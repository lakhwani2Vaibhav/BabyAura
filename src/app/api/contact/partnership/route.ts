
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
    const { hospitalName, hospitalAddress, hospitalSize, adminName, adminEmail, adminPhone, businessModel, comments } = body;

    const emailBody = (
      <>
        <p style={{ margin: 0, marginBottom: '16px' }}>Dear {adminName},</p>
        <p style={{ margin: 0, marginBottom: '16px' }}>We've received your application to partner with BabyAura. Our team will review your information and will be in touch with you shortly. Below is a summary of the details you submitted.</p>
        
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '5px', margin: '20px 0', textAlign: 'left' }}>
            <h3 style={{ margin: 0, marginBottom: '10px', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Hospital Details</h3>
            <p style={{ margin: 0 }}><strong>Name:</strong> {hospitalName}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Address:</strong> {hospitalAddress}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Size:</strong> {hospitalSize} beds</p>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '5px', margin: '20px 0', textAlign: 'left' }}>
             <h3 style={{ margin: 0, marginBottom: '10px', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Contact Person</h3>
            <p style={{ margin: 0 }}><strong>Name:</strong> {adminName}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Email:</strong> {adminEmail}</p>
            <p style={{ margin: 0, marginTop: '8px' }}><strong>Phone:</strong> {adminPhone}</p>
        </div>
        
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '5px', margin: '20px 0', textAlign: 'left' }}>
             <h3 style={{ margin: 0, marginBottom: '10px', color: '#4f46e5', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Partnership Details</h3>
            <p style={{ margin: 0 }}><strong>Preferred Model:</strong> {businessModel}</p>
            {comments && <p style={{ margin: 0, marginTop: '8px' }}><strong>Comments:</strong><br/>{comments}</p>}
        </div>

        <p style={{ marginTop: '24px' }}>Best Regards,<br/><strong>The BabyAura Partnership Team</strong></p>
      </>
    );

    const emailHtml = render(<DynamicEmail title="Partnership Application Received" body={emailBody} />);

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
