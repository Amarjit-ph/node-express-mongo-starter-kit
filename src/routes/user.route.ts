import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import _ from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import auth from './../middleware/auth.middleware';
import { User, validateUser } from './../models/user.model';
import { BlacklistedToken } from './../models/blacklisted-token.model';
import { JwtPayload } from 'jsonwebtoken';
import { getBlacklistedTokenStats } from './../utils/token-cleanup';

// You might have your own RequestWithUser type for the auth middleware
interface AuthenticatedRequest extends Request {
    user?: { _id: string };
}

const router = express.Router();


// Register a new user
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
        config.get<string>('JWT_PRIVATE_KEY'),
        { expiresIn: '1h' }
    );
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

// Get user details
router.get('/me', auth, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) return res.status(401).send('Unauthorized');
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


// Logout route - requires authentication
router.post('/logout', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(400).send('Token not found in request');
        }

        // Decode token to get expiration time
        const decoded = jwt.decode(token) as JwtPayload;
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.exp) {
            return res.status(400).send('Invalid token format');
        }

        // Calculate expiration date
        const expiresAt = new Date(decoded.exp * 1000);

        // Add token to blacklist
        await BlacklistedToken.create({
            token,
            userId: req.user._id || (decoded as any)._id,
            expiresAt
        });

        res.status(200).json({
            message: 'Logout successful. Token has been invalidated.',
            success: true
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Error during logout',
            success: false
        });
    }
});

// Get blacklisted token statistics (for monitoring)
router.get('/token-stats', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const stats = await getBlacklistedTokenStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting token stats:', error);
        res.status(500).json({
            message: 'Error retrieving token statistics',
            success: false
        });
    }
});

// Manual cleanup of expired tokens (for administrative purposes)
router.post('/cleanup-tokens', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const { cleanupExpiredTokens } = await import('./../utils/token-cleanup');
        const cleanedCount = await cleanupExpiredTokens();

        res.status(200).json({
            success: true,
            message: `Cleanup completed. Removed ${cleanedCount} expired tokens.`,
            data: { cleanedCount }
        });
    } catch (error) {
        console.error('Error during token cleanup:', error);
        res.status(500).json({
            message: 'Error during token cleanup',
            success: false
        });
    }
});

export default router;
