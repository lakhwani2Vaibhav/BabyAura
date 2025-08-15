import { NextRequest, NextResponse } from "next/server";
import * as brevo from '@getbrevo/brevo';

let apiInstance: brevo.TransactionalEmailsApi | null = null;

if (process.env.BREVO_API_KEY) {
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
} else {
  console.warn('BREVO_API_KEY is not set. Email notifications will be disabled.');
}

export async function POST(req: NextRequest) {
    if (!apiInstance) {
        return NextResponse.json({ message: "Email service is not configured correctly on the server." }, { status: 500 });
    }

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Contact Form', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Support' },
        { email: email, name: name }
    ];
    sendSmtpEmail.subject = `Message Received: ${subject}`;
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #333; background-color: #f4f4f7; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
                .header { background-color: #4f46e5; color: #ffffff; padding: 24px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 24px; }
                .content p { margin-bottom: 16px; }
                .details-box { background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px; }
                .details-box h2 { font-size: 18px; color: #4a5568; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;}
                .details-box p { margin-bottom: 8px; }
                .message-content { white-space: pre-wrap; font-style: italic; color: #4a5568; }
                .footer { text-align: center; font-size: 12px; color: #718096; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank you for contacting us!</h1>
                </div>
                <div class="content">
                    <p>Hi ${name},</p>
                    <p>We have received your message and will get back to you as soon as possible. Below is a copy of your submission for your records.</p>
                    <div class="details-box">
                        <h2>Your Message Details:</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <h3 style="font-size: 16px; margin-top: 16px; margin-bottom: 8px; color: #4a5568;">Message:</h3>
                        <p class="message-content">"${message}"</p>
                    </div>
                    <p style="margin-top: 24px;">Best Regards,<br><strong>The BabyAura Support Team</strong></p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} BabyAura. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;
    sendSmtpEmail.replyTo = { email: email, name: name };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Failed to process contact form:", error);
    return NextResponse.json({ message: "An unexpected error occurred while sending the email." }, { status: 500 });
  }
}
