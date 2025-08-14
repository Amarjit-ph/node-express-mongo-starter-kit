import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import Joi from 'joi';

// Post document interface
export interface IPost extends Document {
    title: string;
    content: string;
    userId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Mongoose schema
const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Joi validation
export function validate(post: {
    title: string;
    content: string;
    userId: string;
}) {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        userId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    });

    return schema.validate(post);
}

// Mongoose model
export const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
