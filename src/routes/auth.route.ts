import bcrypt from 'bcrypt';
import Joi from 'joi';
import express, { Request, Response } from 'express';
import _ from 'lodash';
import { User, IUser } from '../models/user.model';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email }) as IUser | null;
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(body: { email: string; password: string }) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(body);
}

export default router;
