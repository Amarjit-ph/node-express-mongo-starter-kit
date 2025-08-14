import express, { Request, Response } from 'express';
import _ from 'lodash';
import { Post, validate, IPost } from '../models/post.model';
import auth, { AuthenticatedRequest } from '../middleware/auth.middleware';

const router = express.Router();

// GET all posts
router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET posts by specific user
router.get('/:userId', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new post
router.post('/', auth, async (req: AuthenticatedRequest, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const post: IPost = new Post(_.pick(req.body, ['title', 'content', 'userId']));
    await post.save();

    res.status(200).send('Post Created');
});

export default router;
