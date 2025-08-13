'use server';

import * as brevo from '@getbrevo/brevo';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { OnboardingEmail } from '@/components/emails/OnboardingEmail';
import { renderToStaticMarkup } from 'react-dom/server';

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

const FROM_EMAIL = 'noreply@babyaura.in';
const FROM_NAME = 'BabyAura Team';

interface WelcomeEmailProps {
  recipientEmail: string;
  recipientName: string;
  role: 'Parent' | 'Doctor' | 'Admin';
}

export const sendWelcomeEmail = async ({
  recipientEmail,
  recipientName,
  role,
}: WelcomeEmailProps) => {
  const emailHtml = renderToStaticMarkup(WelcomeEmail({
      name: recipientName,
      role,
  }));

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: recipientEmail, name: recipientName }];
  sendSmtpEmail.from = { email: FROM_EMAIL, name: FROM_NAME };
  sendSmtpEmail.subject = 'Welcome to BabyAura!';
  sendSmtpEmail.htmlContent = emailHtml;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Welcome email sent successfully. Returned data: ', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};


interface OnboardingEmailProps {
  recipientEmail: string;
  recipientName: string;
  role: 'Parent' | 'Doctor';
  hospitalName: string;
  temporaryPassword?: string;
}

export const sendOnboardingEmail = async ({
    recipientEmail,
    recipientName,
    role,
    hospitalName,
    temporaryPassword
}: OnboardingEmailProps) => {
    const emailHtml = renderToStaticMarkup(OnboardingEmail({
        name: recipientName,
        role,
        hospitalName,
        temporaryPassword,
    }));

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: recipientEmail, name: recipientName }];
    sendSmtpEmail.from = { email: FROM_EMAIL, name: FROM_NAME };
    sendSmtpEmail.subject = `You've been invited to join BabyAura by ${hospitalName}`;
    sendSmtpEmail.htmlContent = emailHtml;

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Onboarding email sent successfully. Returned data: ', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error sending onboarding email:', error);
        throw error;
    }
}
