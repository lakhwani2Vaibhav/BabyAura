
'use server';

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/services/user-service";
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";

let apiInstance: brevo.TransactionalEmailsApi | null = null;

if (process.env.BREVO_API_KEY) {
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
} else {
  console.warn('BREVO_API_KEY is not set. Email notifications will be disabled.');
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ownerName, hospitalName, email, password, address, mobile } = body;

    if (!ownerName || !hospitalName || !email || !password || !address || !mobile) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "A hospital with this email already exists." },
        { status: 409 }
      );
    }

    const newHospital = await createUser({
        ownerName,
        hospitalName,
        email,
        password,
        address,
        mobile,
        role: 'Admin',
    });

    if (apiInstance) {
        const emailHtml = render(<WelcomeEmail name={ownerName} role="Admin" />);
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.sender = { name: 'BabyAura', email: 'noreply@babyaura.in' };
        sendSmtpEmail.to = [{ email, name: ownerName }];
        sendSmtpEmail.subject = 'Welcome to BabyAura!';
        sendSmtpEmail.htmlContent = emailHtml;
        
        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (e) {
            console.error("Failed to send welcome email:", e);
            // Don't block registration if email fails, just log it.
        }
    }


    const { password: _, ...hospitalWithoutPassword } = newHospital;

    return NextResponse.json(hospitalWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Hospital registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
