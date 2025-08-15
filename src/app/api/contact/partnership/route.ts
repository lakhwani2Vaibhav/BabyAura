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
        <html>
        <body>
            <h1>Thank you for your partnership application!</h1>
            <p>We have received your application and our team will be in touch with you shortly. Below is a summary of the information you submitted.</p>
            <hr />
            <h2>Hospital Details</h2>
            <ul>
            <li><strong>Name:</strong> ${hospitalName}</li>
            <li><strong>Address:</strong> ${hospitalAddress}</li>
            <li><strong>Size:</strong> ${hospitalSize} beds</li>
            </ul>
            <h2>Contact Person</h2>
            <ul>
            <li><strong>Name:</strong> ${adminName}</li>
            <li><strong>Email:</strong> ${adminEmail}</li>
            <li><strong>Phone:</strong> ${adminPhone}</li>
            </ul>
            <h2>Partnership Details</h2>
            <ul>
            <li><strong>Preferred Model:</strong> ${businessModel}</li>
            <li><strong>Comments:</strong> ${comments || 'N/A'}</li>
            </ul>
            <hr />
            <p>Best Regards,<br/>The BabyAura Team</p>
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
