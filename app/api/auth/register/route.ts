import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import { generateToken } from '@/app/lib/auth';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, business_name, plan = 'free' } = await request.json();

    // Validation
    if (!name || !email || !password || !business_name) {
      return errorResponse('Missing required fields', 400);
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      business_name,
      plan,
      is_premium: plan === 'premium',
      template_id: plan === 'premium' ? 'TEMPLATE_01' : null,
    });

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
      created_at: user.created_at.toISOString(),
    };

    return successResponse('User registered successfully', {
      user: userResponse,
      auth: {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
      },
    }, 201);

  } catch (error: any) {
    console.error('Registration error:', error);
    return errorResponse('Internal server error', 500);
  }
}