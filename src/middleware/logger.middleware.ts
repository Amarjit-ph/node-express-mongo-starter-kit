import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

function logRequest(req: Request, res: Response, next: NextFunction): void {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
}

export default logRequest;
