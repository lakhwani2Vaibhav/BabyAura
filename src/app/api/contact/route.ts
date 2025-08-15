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
        { email: 'contact@babyaura.in', name: 'BabyAura Support' },
        { email: email, name: name }
    ];
    sendSmtpEmail.subject = `Message Received: ${subject}`;
    sendSmtpEmail.htmlContent = `
        <html>
        <body>
            <h1>Thank you for contacting us!</h1>
            <p>We have received your message and will get back to you as soon as possible. Below is a copy of your submission.</p>
            <hr />
            <h2>Your Message Details:</h2>
            <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Subject:</strong> ${subject}</li>
            </ul>
            <h2>Message:</h2>
            <p style="white-space: pre-wrap;">${message}</p>
            <hr />
            <p>Best Regards,<br/>The BabyAura Support Team</p>
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
