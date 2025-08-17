
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, setPasswordResetToken } from '@/services/user-service';
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';
import crypto from 'crypto';

let apiInstance: brevo.TransactionalEmailsApi | null = null;
if (process.env.BREVO_API_KEY) {
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await setPasswordResetToken(user._id, user.role, {
        passwordResetToken,
        passwordResetExpires,
      });

      const resetUrl = `https://babyaura.in/auth/reset-password?token=${resetToken}`;
      
      if (apiInstance) {
          const emailHtml = render(PasswordResetEmail({ name: user.name, resetLink: resetUrl }));
          const sendSmtpEmail = new brevo.SendSmtpEmail();
          sendSmtpEmail.sender = { name: 'BabyAura Support', email: 'noreply@babyaura.in' };
          sendSmtpEmail.to = [{ email: user.email, name: user.name }];
          sendSmtpEmail.subject = 'Your BabyAura Password Reset Request';
          sendSmtpEmail.htmlContent = emailHtml;
          
          try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
          } catch(e) {
             console.error("Failed to send password reset email:", e);
          }
      }
    }
    
    // Always return a success message to prevent user enumeration attacks
    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
