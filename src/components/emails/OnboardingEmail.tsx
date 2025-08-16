
import * as React from 'react';

interface OnboardingEmailProps {
  name: string;
  role: 'Parent' | 'Doctor';
  hospitalName: string;
  temporaryPassword?: string;
  email: string;
}

const getRoleSpecificContent = (role: 'Parent' | 'Doctor', hospitalName: string) => {
  switch (role) {
    case 'Parent':
      return {
        loginPath: 'auth/login',
        callToAction: 'Access Your Parent Dashboard',
        message: `Your medical team at ${hospitalName} has created an account for you on BabyAura, a digital platform to support you and your baby after you leave the hospital.`,
      };
    case 'Doctor':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Access Your Doctor Dashboard',
        message: `Your hospital administrator at ${hospitalName} has created a Doctor account for you on the BabyAura platform. You can now provide seamless digital care to your patients.`,
      };
    default:
        return {
            loginPath: 'auth/login',
            callToAction: 'Login to Your Account',
            message: `You've been invited to join BabyAura!`
        }
  }
};


export const OnboardingEmail: React.FC<Readonly<OnboardingEmailProps>> = ({ name, role, hospitalName, temporaryPassword, email }) => {
  const { loginPath, callToAction, message } = getRoleSpecificContent(role, hospitalName);
  const fullLoginUrl = `https://babyaura.in/${loginPath}`;

  return (
    <html lang="en">
      <head>
        <style>{`
          body { font-family: sans-serif; line-height: 1.6; }
          .button { padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
          .credentials { background-color: #f0f0f0; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        `}</style>
      </head>
      <body>
        <h1>You're invited to join BabyAura!</h1>
        <p>Hi {name},</p>
        <p>{message}</p>
        <p>Log in with the credentials below. We strongly recommend changing your password after your first login.</p>
        <div className="credentials">
          <p><strong>Email:</strong> {email}</p>
          {temporaryPassword && <p><strong>Temporary Password:</strong> {temporaryPassword}</p>}
        </div>
        <a href={fullLoginUrl} className="button">
          {callToAction}
        </a>
        <p>If you have any questions, please contact your administrator at {hospitalName}.</p>
        <p>Best,<br />The BabyAura Team</p>
      </body>
    </html>
  );
};
