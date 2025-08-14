import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided');
    }
    try {
        const decoded = jwt.verify(token, config.get<string>('JWT_PRIVATE_KEY'));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}
export default auth;
