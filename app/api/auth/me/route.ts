import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import { authenticateToken } from '@/app/lib/auth';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const decoded = authenticateToken(authHeader);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      business_name: user.business_name,
      plan: user.plan,
      template_id: user.template_id,
      is_premium: user.is_premium,
      subscription: user.subscription,
      created_at: user.created_at.toISOString(),
      last_login: user.last_login.toISOString(),
    };

    return successResponse('User profile retrieved successfully', {
      user: userResponse,
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid or expired token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}