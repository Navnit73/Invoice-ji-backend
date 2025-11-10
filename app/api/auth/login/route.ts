import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import { generateToken } from '@/app/lib/auth';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate token
    const access_token = generateToken(user);

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      business_name: user.business_name,
      plan: user.plan,
      template_id: user.template_id,
      is_premium: user.is_premium,
    };

    return successResponse('Login successful', {
      user: userResponse,
      auth: {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}