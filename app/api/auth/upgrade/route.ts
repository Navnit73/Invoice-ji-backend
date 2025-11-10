import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/models/User';
import { authenticateToken } from '@/app/lib/auth';
import { successResponse, errorResponse } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const decoded = authenticateToken(authHeader);

    const { plan = 'premium', payment_id } = await request.json();

    if (!payment_id) {
      return errorResponse('Payment ID is required', 400);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Update user plan
    user.plan = plan;
    user.is_premium = true;
    user.template_id = 'TEMPLATE_03'; // Default premium template
    
    // Set subscription info
    user.subscription = {
      plan_name: 'Pro Monthly',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      active: true,
    };

    await user.save();

    const userResponse = {
      id: user._id.toString(),
      plan: user.plan,
      is_premium: user.is_premium,
      template_id: user.template_id,
    };

    return successResponse('User upgraded to premium plan', {
      user: userResponse,
    });

  } catch (error: any) {
    console.error('Upgrade error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid or expired token') {
      return errorResponse('Unauthorized', 401);
    }
    return errorResponse('Internal server error', 500);
  }
}