import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import _ from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import auth from './../middleware/auth.middleware';
import { User, validateUser } from './../models/user.model';

// You might have your own RequestWithUser type for the auth middleware
interface AuthenticatedRequest extends Request {
    user?: { _id: string };
}

const router = express.Router();

router.get(
    '/me',
    auth,
    async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user) return res.status(401).send('Unauthorized');
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    }
);

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    await user.save();
    const token = jwt.sign(
        { _id: user._id },
        config.get<string>('JWT_PRIVATE_KEY')
    );
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

export default router;
