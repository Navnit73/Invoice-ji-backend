import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import Token from '@/models/Token';
import { generateRandomToken } from '@/app/lib/utils';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return errorResponse('Email is required', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security
      return successResponse('Password reset link sent to your email');
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    
    // Save token to database
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // TODO: Send email with reset link
    // For now, we'll just return success
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return successResponse('Password reset link sent to your email');

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return errorResponse('Internal server error', 500);
  }
}