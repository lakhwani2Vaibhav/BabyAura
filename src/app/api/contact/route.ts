
import { NextRequest, NextResponse } from "next/server";
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { DynamicEmail } from "@/components/emails/DynamicEmail";

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
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const emailBody = (
      <>
        <p style={{ margin: 0, marginBottom: '16px' }}>Hi {name},</p>
        <p style={{ margin: 0, marginBottom: '16px' }}>We've received your message and our team will get back to you as soon as possible. Below is a copy of your submission for your records.</p>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '5px', margin: '20px 0', textAlign: 'left' }}>
            <p style={{ margin: 0 }}><strong>Name:</strong> {name}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Phone:</strong> {phone}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Subject:</strong> {subject}</p>
            <p style={{ margin: 0, marginTop: '16px', fontStyle: 'italic' }}>"{message}"</p>
        </div>
      </>
    );

    const emailHtml = render(<DynamicEmail title="Message Received" body={emailBody} />);
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'BabyAura Contact Form', email: 'noreply@babyaura.in' };
    sendSmtpEmail.to = [
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Support' },
        { email: email, name: name }
    ];
    sendSmtpEmail.subject = `Message Received: ${subject}`;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.replyTo = { email: email, name: name };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

  } catch (error: any) {
    console.error("Failed to process contact form:", error);
    const errorMessage = error.response?.body?.message || "An unexpected error occurred while sending the email.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
