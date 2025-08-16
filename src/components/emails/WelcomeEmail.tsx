
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
             body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .header { text-align: center; padding: 24px; }
            .content { padding: 24px; text-align: left; }
            .content h1 { font-size: 24px; color: #1e293b; margin-bottom: 16px; }
            .content p { font-size: 16px; color: #475569; margin-bottom: 16px; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; border-top: 1px solid #e2e8f0;}
          `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <img src="https://res.cloudinary.com/dg0qkunjk/image/upload/v1751958248/grok_image_xkp1vgg_f6s9on.jpg" alt="BabyAura Logo" width="120" style={{display: 'inline-block'}} />
          </div>
          <div className="content">
            <h1>Welcome to BabyAura!</h1>
            <h2>Hi {name},</h2>
            <p>{message}</p>
            <p>We're here to help you provide or receive the best possible care throughout the early stages of childhood.</p>
            <div className="button-container">
              <a href={fullLoginUrl} className="button">
                {callToAction}
              </a>
            </div>
            <p>If you have any questions, feel free to contact our support team at <a href="mailto:contact@babyaura.in" style={{color: '#4f46e5'}}>contact@babyaura.in</a>.</p>
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
