import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  business_name: string;
  plan: 'free' | 'premium';
  template_id: string | null;
  is_premium: boolean;
  subscription?: {
    plan_name: string;
    start_date: Date;
    end_date: Date;
    active: boolean;
  };
  created_at: Date;
  last_login: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  business_name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  template_id: {
    type: String,
    default: null,
  },
  is_premium: {
    type: Boolean,
    default: false,
  },
  subscription: {
    plan_name: String,
    start_date: Date,
    end_date: Date,
    active: Boolean,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);