
import { render } from '@react-email/render';
import { capitalize } from '@/lib/utils';
import * as React from 'react';

interface AccountStatusUpdateEmailProps {
  name: string;
  hospitalName: string;
  status: 'verified' | 'suspended' | 'rejected' | 'pending_verification' | 'reactivated' | string;
  supportEmail: string;
}

const statusContent = {
    verified: {
        title: "Welcome Aboard! Your Hospital is Verified!",
        greeting: "Congratulations!",
        message: "We are thrilled to inform you that your hospital, has been successfully verified and is now active on the BabyAura platform. You can now access your full administrator dashboard to manage your team and begin onboarding parents.",
        action: "Go to Dashboard"
    },
    suspended: {
        title: "Action Required: Your Account has been Suspended",
        greeting: "Important Notice",
        message: "This email is to inform you that your hospital's account has been temporarily suspended due to a violation of our platform policies or unresolved administrative issues. Access to your dashboard will be restricted until this matter is resolved.",
        action: "Contact Support"
    },
    rejected: {
        title: "Update on Your BabyAura Application",
        greeting: "Application Update",
        message: "Thank you for your interest in joining the BabyAura network. After careful review, we regret to inform you that we are unable to proceed with your application at this time. If you believe this is in error or wish to provide more information, please contact our support team.",
        action: "Contact Support"
    },
    reactivated: {
        title: "Your Hospital Account has been Reactivated!",
        greeting: "Welcome Back!",
        message: "We're pleased to inform you that your hospital account has been reactivated. Full access to your dashboard and all features has been restored. We look forward to continuing our partnership.",
        action: "Go to Dashboard"
    }
}

export const AccountStatusUpdateEmail: React.FC<Readonly<AccountStatusUpdateEmailProps>> = ({ name, hospitalName, status, supportEmail }) => {
  const contentKey = status as keyof typeof statusContent;
  const content = statusContent[contentKey] || {
      title: `Account Status Update: ${capitalize(status)}`,
      greeting: `Hi ${name},`,
      message: `This is to notify you that the status of your hospital, ${hospitalName}, has been updated to "${capitalize(status)}".`,
      action: "Login to View"
  };

  const loginUrl = 'https://babyaura.in/auth/login/admins';

  return (
    <html lang="en">
        <head>
            <style>{`
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f7f7f7; color: #333; }
                .container { max-width: 600px; margin: 40px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                .header h1 { font-size: 24px; color: #1d4ed8; }
                .content { padding: 20px 0; }
                .content p { line-height: 1.6; }
                .button { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 20px; }
                .footer { text-align: center; font-size: 12px; color: #888; padding-top: 20px; border-top: 1px solid #eee; }
            `}</style>
        </head>
        <body>
            <div className="container">
                <div className="header">
                    <h1>{content.title}</h1>
                </div>
                <div className="content">
                    <p>Dear {name},</p>
                    <p>{content.greeting}</p>
                    <p>{content.message.replace('has been successfully verified and is now active on the BabyAura platform.', `<strong>${hospitalName}</strong>, has been successfully verified and is now active on the BabyAura platform.`)}</p>
                    {status === 'suspended' && (
                        <div>
                            <p><strong>Possible Reasons for Suspension:</strong></p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Pending KYC document verification.</li>
                                <li>Violation of our platform's terms of service.</li>
                                <li>Unresolved payment or billing issues.</li>
                                <li>Reported misconduct or malpractice.</li>
                                <li>Security concerns related to the account.</li>
                            </ul>
                            <p>To resolve this, please contact our support team immediately.</p>
                        </div>
                    )}
                    <div style={{ textAlign: 'center' }}>
                         <a href={loginUrl} className="button">{content.action}</a>
                    </div>
                </div>
                <div className="footer">
                    <p>If you have any questions, please contact our support team at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>
                    <p>&copy; {new Date().getFullYear()} BabyAura. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
  );
};


export function renderAccountStatusUpdateEmail(props: AccountStatusUpdateEmailProps): string {
    return render(<AccountStatusUpdateEmail {...props} />);
}
