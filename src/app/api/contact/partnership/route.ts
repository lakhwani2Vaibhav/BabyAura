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
    const { hospitalName, hospitalAddress, hospitalSize, adminName, adminEmail, adminPhone, businessModel, comments } = body;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Partnerships', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Team' },
        { email: adminEmail, name: adminName }
    ];
    sendSmtpEmail.subject = `Partnership Application Received: ${hospitalName}`;
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Partnership Application Received</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #333; background-color: #f4f4f7; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
                .header { background-color: #4f46e5; color: #ffffff; padding: 24px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 24px; }
                .content h2 { font-size: 20px; color: #4f46e5; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
                .content p { margin-bottom: 16px; }
                .details-grid { display: grid; grid-template-columns: 150px 1fr; gap: 8px 16px; margin-top: 16px; }
                .details-grid dt { font-weight: 600; color: #4a5568; }
                .details-grid dd { margin: 0; color: #2d3748; }
                .comments { background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px; }
                .footer { text-align: center; font-size: 12px; color: #718096; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You for Your Partnership Application!</h1>
                </div>
                <div class="content">
                    <p>Dear ${adminName},</p>
                    <p>We've received your application to partner with BabyAura. Our team will review your information and will be in touch with you shortly. Below is a summary of the details you submitted.</p>
                    
                    <h2>Hospital Details</h2>
                    <dl class="details-grid">
                        <dt>Name:</dt><dd>${hospitalName}</dd>
                        <dt>Address:</dt><dd>${hospitalAddress}</dd>
                        <dt>Size:</dt><dd>${hospitalSize} beds</dd>
                    </dl>

                    <h2 style="margin-top: 24px;">Contact Person</h2>
                    <dl class="details-grid">
                        <dt>Name:</dt><dd>${adminName}</dd>
                        <dt>Email:</dt><dd>${adminEmail}</dd>
                        <dt>Phone:</dt><dd>${adminPhone}</dd>
                    </dl>
                    
                    <h2 style="margin-top: 24px;">Partnership Details</h2>
                    <dl class="details-grid">
                        <dt>Preferred Model:</dt><dd>${businessModel}</dd>
                    </dl>
                    ${comments ? `
                    <div class="comments">
                        <h3 style="font-size: 16px; color: #4a5568; margin-top: 0;">Your Comments:</h3>
                        <p style="white-space: pre-wrap; margin-bottom: 0;">${comments}</p>
                    </div>
                    ` : ''}

                    <p style="margin-top: 24px;">Best Regards,<br><strong>The BabyAura Partnership Team</strong></p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} BabyAura. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;
     sendSmtpEmail.replyTo = { email: adminEmail, name: adminName };


    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Application received successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to process partnership application:", error);
    return NextResponse.json({ message: "An unexpected error occurred while sending the email." }, { status: 500 });
  }
}
