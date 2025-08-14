import express, { Application } from 'express';
import usersRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import postRoutes from './routes/post.route';
import logger from './middleware/logger.middleware';

const app: Application = express();

app.use(express.json());
app.use(logger);

app.use('/api/v1/user', usersRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);

export default app;
