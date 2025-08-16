
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
    const { name, hospitalName, email, phone, message } = body;

    // Validate required fields
    if (!name || !hospitalName || !email || !phone) {
        return NextResponse.json({ message: "Name, hospital name, email, and phone are required." }, { status: 400 });
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
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        <head>
          <title></title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none; background-color: #f0f4f8; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
            .header { padding: 24px; text-align: center; }
            .content { padding: 24px; }
            .content h1 { font-family: 'Poppins', sans-serif; font-size: 24px; color: #1e293b; margin: 0 0 16px; }
            .content p { font-family: 'Poppins', sans-serif; font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px; }
            .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px; }
            .details-box h2 { font-size: 18px; color: #1e293b; margin-top: 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: 'Poppins', sans-serif; }
            .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dg0qkunjk/image/upload/v1751958248/grok_image_xkp1vgg_f6s9on.jpg" alt="BabyAura Logo" width="120" style="display:inline-block;">
            </div>
            <div class="content">
                <h1>Thank You for Your Interest!</h1>
                <p>Dear ${name},</p>
                <p>We've received your request for a demo of BabyAura. Our team will review your information and get in touch with you shortly to schedule a convenient time. Here is a summary of your request:</p>
                
                <div class="details-box">
                    <h2 style="font-size: 18px; color: #1e293b; margin-top: 0;">Request Details:</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Hospital:</strong> ${hospitalName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
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
  } catch (error: any) {
    console.error("Failed to process demo request:", error);
    const errorMessage = error.response?.body?.message || "An unexpected error occurred while sending the email.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
