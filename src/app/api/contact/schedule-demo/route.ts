
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
    const { name, hospitalName, email, phone, message } = body;

    // Validate required fields
    if (!name || !hospitalName || !email || !phone) {
        return NextResponse.json({ message: "Name, hospital name, email, and phone are required." }, { status: 400 });
    }
    
    const emailBody = (
       <>
        <p style={{ margin: 0, marginBottom: '16px' }}>Dear {name},</p>
        <p style={{ margin: 0, marginBottom: '16px' }}>We've received your request for a demo of BabyAura. Our team will review your information and get in touch with you shortly to schedule a convenient time. Here is a summary of your request:</p>
        
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '5px', margin: '20px 0', textAlign: 'left' }}>
            <p style={{ margin: 0 }}><strong>Name:</strong> {name}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Hospital:</strong> {hospitalName}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Phone:</strong> {phone}</p>
            {message && <p style={{ margin: 0, marginTop: '8px' }}><strong>Message:</strong><br/>{message}</p>}
        </div>

        <p style={{ marginTop: '24px' }}>We look forward to speaking with you!</p>
        <p>Best Regards,<br/><strong>The BabyAura Partnership Team</strong></p>
      </>
    );

    const emailHtml = render(<DynamicEmail title="Thank You for Your Interest!" body={emailBody} />);


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
