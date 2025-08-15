import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistedToken extends Document {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // TTL index to automatically remove expired tokens
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const BlacklistedToken = mongoose.model<IBlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);
