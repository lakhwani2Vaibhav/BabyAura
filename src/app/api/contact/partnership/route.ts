
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalName, hospitalAddress, hospitalSize, adminName, adminEmail, adminPhone, businessModel, comments } = body;

    // Explicitly check for environment variables
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_API_KEY) {
        console.error("Missing Brevo credentials in .env file");
        return NextResponse.json({ message: "Email service is not configured correctly. Please contact the administrator." }, { status: 500 });
    }

    // 1. Configure the transporter using your Brevo credentials from .env
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_SMTP_USER, // e.g., your brevo login email
        pass: process.env.BREVO_API_KEY,   // your brevo SMTP key
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `"BabyAura Partnerships" <noreply@babyaura.in>`,
      replyTo: `"${adminName}" <${adminEmail}>`,
      to: `babyauraindia@gmail.com, ${adminEmail}`,
      subject: `Partnership Application Received: ${hospitalName}`,
      html: `
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
      `,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Application received successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to process partnership application:", error);
    // Check for authentication errors specifically
    if ((error as any).code === 'EAUTH') {
        return NextResponse.json({ message: "Could not send email. Please check server credentials." }, { status: 500 });
    }
    return NextResponse.json({ message: "An unexpected error occurred while sending the email." }, { status: 500 });
  }
}
