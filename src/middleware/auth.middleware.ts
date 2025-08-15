import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import { BlacklistedToken } from '../models/blacklisted-token.model';

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

async function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided');
    }
    
    try {
        // Check if token is blacklisted
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).send('Token has been invalidated');
        }
        
        const decoded = jwt.verify(token, config.get<string>('JWT_PRIVATE_KEY'));
        req.user = decoded;
        if (typeof decoded === 'object' && '_id' in decoded) {
            req.body.userId = (decoded as JwtPayload & { _id?: string })._id as string;
        }
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}
export default auth;
