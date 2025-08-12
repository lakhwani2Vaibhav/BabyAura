
import * as React from 'react';

interface OnboardingEmailProps {
  name: string;
  role: 'Parent' | 'Doctor';
  hospitalName: string;
  temporaryPassword?: string;
}

const getRoleSpecificContent = (role: 'Parent' | 'Doctor') => {
  switch (role) {
    case 'Parent':
      return {
        loginPath: 'auth/login',
        callToAction: 'Access Your Parent Dashboard',
        message: `Your medical team at ${name} has created an account for you on BabyAura, a digital platform to support you and your baby after you leave the hospital.`,
      };
    case 'Doctor':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Access Your Doctor Dashboard',
        message: `Your hospital administrator has created a Doctor account for you on the BabyAura platform. You can now provide seamless digital care to your patients.`,
      };
    default:
        return {
            loginPath: 'auth/login',
            callToAction: 'Login to Your Account',
            message: `You've been invited to join BabyAura!`
        }
  }
};


export const OnboardingEmail: React.FC<Readonly<OnboardingEmailProps>> = ({ name, role, hospitalName, temporaryPassword }) => {
  const { loginPath, callToAction, message } = getRoleSpecificContent(role);
  const fullLoginUrl = `https://babyaura.in/${loginPath}`;

  return (
    <html lang="en">
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
          .content { padding: 20px 0; }
          .credentials { background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #777; padding-top: 20px; border-top: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>You're invited to join BabyAura!</h1>
          </div>
          <div className="content">
            <h2>Hi {name},</h2>
            <p>{message}</p>
            <p>Log in with the credentials below. We strongly recommend changing your password after your first login.</p>
            <div className="credentials">
              <p><strong>Email:</strong> {name}</p>
              {temporaryPassword && <p><strong>Temporary Password:</strong> {temporaryPassword}</p>}
            </div>
            <p style={{ textAlign: 'center', margin: '30px 0' }}>
              <a href={fullLoginUrl} className="button" style={{ color: '#ffffff' }}>
                {callToAction}
              </a>
            </p>
            <p>If you have any questions, please contact your administrator at {hospitalName} or our support team at <a href="mailto:contact@babyaura.in">contact@babyaura.in</a>.</p>
            <p>Best,<br />The BabyAura Team</p>
          </div>
          <div className="footer">
            <p>&copy; {new Date().getFullYear()} BabyAura. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
};
