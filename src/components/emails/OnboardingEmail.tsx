
import * as React from 'react';

interface OnboardingEmailProps {
  name: string;
  role: 'Parent' | 'Doctor';
  hospitalName: string;
  temporaryPassword?: string;
  email: string;
}

export const OnboardingEmail: React.FC<Readonly<OnboardingEmailProps>> = ({ name, role, hospitalName, temporaryPassword, email }) => {
  return (
    <html lang="en">
      <body>
        <h1>You're invited to join BabyAura!</h1>
        <p>Hi {name},</p>
        <p>Your {role} account has been created by {hospitalName}.</p>
        <p>Log in with the credentials below. We strongly recommend changing your password after your first login.</p>
        <div>
          <p><strong>Email:</strong> {email}</p>
          {temporaryPassword && <p><strong>Temporary Password:</strong> {temporaryPassword}</p>}
        </div>
        <p>If you have any questions, please contact your administrator at {hospitalName}.</p>
        <p>Best,<br />The BabyAura Team</p>
      </body>
    </html>
  );
};
