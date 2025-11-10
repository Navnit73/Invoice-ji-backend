import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: 'password_reset' | 'email_verification';
  expiresAt: Date;
  used: boolean;
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['password_reset', 'email_verification'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Auto-delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Token || mongoose.model<IToken>('Token', tokenSchema);