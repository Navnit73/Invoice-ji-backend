import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import Token from '@/models/Token';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { token, new_password } = await request.json();

    if (!token || !new_password) {
      return errorResponse('Token and new password are required', 400);
    }

    if (new_password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    // Find valid token
    const resetToken = await Token.findOne({
      token,
      type: 'password_reset',
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return errorResponse('Invalid or expired reset token', 400);
    }

    // Update user password
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    user.password = new_password;
    await user.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    return successResponse('Password reset successful. Please login again.');

  } catch (error: any) {
    console.error('Reset password error:', error);
    return errorResponse('Internal server error', 500);
  }
}