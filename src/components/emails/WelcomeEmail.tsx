
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  role: 'Parent' | 'Doctor' | 'Admin';
}

const getRoleSpecificContent = (role: 'Parent' | 'Doctor' | 'Admin') => {
  switch (role) {
    case 'Parent':
      return {
        loginPath: 'auth/login',
        callToAction: 'Go to Your Dashboard',
        message: "We're so excited to join you on your parenting journey. Your dashboard is ready with tools to track milestones, schedule consultations, and much more.",
      };
    case 'Doctor':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Go to Doctor Dashboard',
        message: 'Thank you for joining the BabyAura network. You can now manage your patients, schedule appointments, and provide seamless digital care.',
      };
    case 'Admin':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Go to Admin Dashboard',
        message: 'Your hospital is now part of the BabyAura network! You can now manage doctors, onboard parents, and view analytics from your admin dashboard.',
      };
    default:
      return {
        loginPath: 'auth/login',
        callToAction: 'Login to Your Account',
        message: "We're excited to have you on board. You can now log in to your account.",
      };
  }
};

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ name, role }) => {
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
          .footer { text-align: center; font-size: 12px; color: #777; padding-top: 20px; border-top: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Welcome to BabyAura!</h1>
          </div>
          <div className="content">
            <h2>Hi {name},</h2>
            <p>{message}</p>
            <p>We're here to help you provide or receive the best possible care throughout the early stages of childhood.</p>
            <p style={{ textAlign: 'center', margin: '30px 0' }}>
              <a href={fullLoginUrl} className="button" style={{ color: '#ffffff' }}>
                {callToAction}
              </a>
            </p>
            <p>If you have any questions, feel free to contact our support team at <a href="mailto:contact@babyaura.in">contact@babyaura.in</a>.</p>
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
