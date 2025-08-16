
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
          body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
          .header { text-align: center; padding: 24px; }
          .content { padding: 24px; text-align: left; }
          .content h1 { font-size: 24px; color: #1e293b; margin-bottom: 16px; }
          .content p { font-size: 16px; color: #475569; margin-bottom: 16px; }
          .credentials { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
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
            <h1>You're invited to join BabyAura!</h1>
            <h2>Hi {name},</h2>
            <p>{message}</p>
            <p>Log in with the credentials below. We strongly recommend changing your password after your first login.</p>
            <div className="credentials">
              <p><strong>Email:</strong> {email}</p>
              {temporaryPassword && <p><strong>Temporary Password:</strong> {temporaryPassword}</p>}
            </div>
            <div className="button-container">
              <a href={fullLoginUrl} className="button">
                {callToAction}
              </a>
            </div>
            <p>If you have any questions, please contact your administrator at {hospitalName} or our support team at <a href="mailto:contact@babyaura.in" style={{color: '#4f46e5'}}>contact@babyaura.in</a>.</p>
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
