import { NextResponse } from 'next/server';

export function successResponse(message: string, data?: any, status = 200) {
  return NextResponse.json({
    status: 'success',
    message,
    ...data,
  }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({
    status: 'error',
    message,
  }, { status });
}

export function generateRandomToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}