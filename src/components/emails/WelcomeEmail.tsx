
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
        subject: 'Welcome to Your Parenting Journey with BabyAura!'
      };
    case 'Doctor':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Go to Doctor Dashboard',
        message: 'Thank you for joining the BabyAura network. You can now manage your patients, schedule appointments, and provide seamless digital care.',
        subject: 'Welcome to the BabyAura Network, Doctor!'
      };
    case 'Admin':
      return {
        loginPath: 'auth/login/admins',
        callToAction: 'Go to Admin Dashboard',
        message: 'Your hospital is now part of the BabyAura network! You can now manage doctors, onboard parents, and view analytics from your admin dashboard.',
        subject: 'Welcome to BabyAura, Hospital Administrator!'
      };
    default:
      return {
        loginPath: 'auth/login',
        callToAction: 'Login to Your Account',
        message: "We're excited to have you on board. You can now log in to your account.",
        subject: 'Welcome to BabyAura!'
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
            body { font-family: sans-serif; line-height: 1.6; }
            .button { padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
          `}</style>
      </head>
      <body>
        <h1>Welcome to BabyAura!</h1>
        <p>Hi {name},</p>
        <p>{message}</p>
        <p>We're here to help you provide or receive the best possible care throughout the early stages of childhood.</p>
        <a href={fullLoginUrl} className="button">
          {callToAction}
        </a>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best,<br />The BabyAura Team</p>
      </body>
    </html>
  );
};
