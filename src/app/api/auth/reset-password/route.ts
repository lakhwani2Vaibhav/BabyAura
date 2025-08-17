
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { findUserByResetToken, resetUserPassword } from '@/services/user-service';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await findUserByResetToken(hashedToken);

    if (!user) {
        return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });
    }

    await resetUserPassword(user._id, user.role, password);

    return NextResponse.json({ message: 'Password has been reset successfully.' });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
