
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
            .content h2 { font-family: 'Poppins', sans-serif; font-size: 20px; color: #4f46e5; margin: 24px 0 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            .content p { font-family: 'Poppins', sans-serif; font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px; }
            .details-grid { display: grid; grid-template-columns: 150px 1fr; gap: 8px 16px; margin-top: 16px; }
            .details-grid dt { font-weight: 600; color: #475569; }
            .details-grid dd { margin: 0; color: #1e293b; }
            .comments-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px; }
            .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://res.cloudinary.com/dg0qkunjk/image/upload/v1751958248/grok_image_xkp1vgg_f6s9on.jpg" alt="BabyAura Logo" width="120" style="display:inline-block;">
            </div>
            <div class="content">
              <h1>Thank You for Your Partnership Application!</h1>
              <p>Dear ${adminName},</p>
              <p>We've received your application to partner with BabyAura. Our team will review your information and will be in touch with you shortly. Below is a summary of the details you submitted.</p>
              
              <h2>Hospital Details</h2>
              <dl class="details-grid">
                  <dt>Name:</dt><dd>${hospitalName}</dd>
                  <dt>Address:</dt><dd>${hospitalAddress}</dd>
                  <dt>Size:</dt><dd>${hospitalSize} beds</dd>
              </dl>

              <h2>Contact Person</h2>
              <dl class="details-grid">
                  <dt>Name:</dt><dd>${adminName}</dd>
                  <dt>Email:</dt><dd>${adminEmail}</dd>
                  <dt>Phone:</dt><dd>${adminPhone}</dd>
              </dl>
              
              <h2>Partnership Details</h2>
              <dl class="details-grid">
                  <dt>Preferred Model:</dt><dd>${businessModel}</dd>
              </dl>
              ${comments ? `
              <div class="comments-box">
                  <h3 style="font-size: 16px; color: #475569; margin-top: 0;">Your Comments:</h3>
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
