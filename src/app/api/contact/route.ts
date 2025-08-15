
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    
    // Explicitly check for environment variables
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_API_KEY) {
        console.error("Missing Brevo credentials in .env file");
        return NextResponse.json({ message: "Email service is not configured correctly. Please contact the administrator." }, { status: 500 });
    }


    // Configure the transporter using your Brevo credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, 
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_API_KEY,
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"BabyAura Contact Form" <noreply@babyaura.in>`,
      replyTo: `"${name}" <${email}>`,
      to: `contact@babyaura.in, ${email}`, // The primary recipient
      subject: `Message Received: ${subject}`,
      html: `
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
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Failed to process contact form:", error);
    if ((error as any).code === 'EAUTH') {
        return NextResponse.json({ message: "Email server authentication failed. Please check server credentials." }, { status: 500 });
    }
    return NextResponse.json({ message: "An unexpected error occurred while sending the email." }, { status: 500 });
  }
}
