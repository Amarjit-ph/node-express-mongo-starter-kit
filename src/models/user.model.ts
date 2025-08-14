import mongoose, { Document, Model, Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';

// Interface for the User document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    generateAuthToken(): string;
}

// Mongoose schema
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1024,
    },
});

// Instance method to generate JWT
userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign({ _id: this._id }, config.get<string>('JWT_PRIVATE_KEY'));
};

// Joi validation
export function validateUser(user: {
    name: string;
    email: string;
    password: string;
}) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(user);
}

// Mongoose model
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);