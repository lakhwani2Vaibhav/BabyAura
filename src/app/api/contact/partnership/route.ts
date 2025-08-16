
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

    const emailHtml = `
        <h1>Partnership Application Received</h1>
        <p>Dear ${adminName},</p>
        <p>We've received your application to partner with BabyAura. Our team will review your information and will be in touch with you shortly. Below is a summary of the details you submitted.</p>
        
        <h2>Hospital Details</h2>
        <p><strong>Name:</strong> ${hospitalName}</p>
        <p><strong>Address:</strong> ${hospitalAddress}</p>
        <p><strong>Size:</strong> ${hospitalSize} beds</p>

        <h2>Contact Person</h2>
        <p><strong>Name:</strong> ${adminName}</p>
        <p><strong>Email:</strong> ${adminEmail}</p>
        <p><strong>Phone:</strong> ${adminPhone}</p>
        
        <h2>Partnership Details</h2>
        <p><strong>Preferred Model:</strong> ${businessModel}</p>
        ${comments ? `<p><strong>Comments:</strong><br/>${comments}</p>` : ''}

        <p>Best Regards,<br/><strong>The BabyAura Partnership Team</strong></p>
    `;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Partnerships', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Team' },
        { email: adminEmail, name: adminName }
    ];
    sendSmtpEmail.subject = `Partnership Application Received: ${hospitalName}`;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.replyTo = { email: adminEmail, name: adminName };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Application received successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to process partnership application:", error);
    return NextResponse.json({ message: "An unexpected error occurred while sending the email." }, { status: 500 });
  }
}
