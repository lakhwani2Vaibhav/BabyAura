
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
    
    const emailHtml = `
        <h1>Thank You for Your Interest!</h1>
        <p>Dear ${name},</p>
        <p>We've received your request for a demo of BabyAura. Our team will review your information and get in touch with you shortly to schedule a convenient time. Here is a summary of your request:</p>
        
        <h2>Your Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Hospital:</strong> ${hospitalName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}

        <p>We look forward to speaking with you!</p>
        <p>Best Regards,<br/><strong>The BabyAura Partnership Team</strong></p>
    `;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Demo Team', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Team' },
        { email: email, name: name }
    ];
    sendSmtpEmail.subject = `Demo Request from ${hospitalName}`;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.replyTo = { email: email, name: name };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Demo request received successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to process demo request:", error);
    const errorMessage = error.response?.body?.message || "An unexpected error occurred while sending the email.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
