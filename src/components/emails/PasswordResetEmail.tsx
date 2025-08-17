
import * as React from 'react';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({ name, resetLink }) => {
  return (
    <html lang="en">
        <head>
            <style>{`
                body { font-family: sans-serif; }
                .container { padding: 20px; }
                .button { background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            `}</style>
        </head>
        <body>
            <div className="container">
                <h1>Password Reset Request</h1>
                <p>Hi {name},</p>
                <p>We received a request to reset your password for your BabyAura account. You can reset your password by clicking the link below:</p>
                <a href={resetLink} className="button">Reset Your Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                <p>This link will expire in 1 hour.</p>
                <p>Best,<br />The BabyAura Team</p>
            </div>
        </body>
    </html>
  );
};
