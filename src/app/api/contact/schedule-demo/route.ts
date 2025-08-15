
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
    const { name, hospitalName, email, message } = body;

    // Validate required fields
    if (!name || !hospitalName || !email) {
        return NextResponse.json({ message: "Name, hospital name, and email are required." }, { status: 400 });
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Demo Team', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Team' },
        { email: email, name: name }
    ];
    sendSmtpEmail.subject = `Demo Request from ${hospitalName}`;
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Demo Request Received</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f7; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .header { background-color: #4f46e5; color: #ffffff; padding: 24px; text-align: center; }
                .content { padding: 24px; }
                .details-box { background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 16px; margin-top: 16px; border-radius: 6px; }
                .footer { text-align: center; font-size: 12px; color: #718096; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You for Your Interest!</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>We've received your request for a demo of BabyAura. Our team will review your information and get in touch with you shortly to schedule a convenient time. Here is a summary of your request:</p>
                    
                    <div class="details-box">
                        <h2 style="font-size: 18px; color: #4a5568; margin-top: 0;">Request Details:</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Hospital:</strong> ${hospitalName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
                    </div>

                    <p style="margin-top: 24px;">We look forward to speaking with you!</p>
                    <p>Best Regards,<br><strong>The BabyAura Partnership Team</strong></p>
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

    return NextResponse.json({ message: "Demo request received successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to process demo request:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
