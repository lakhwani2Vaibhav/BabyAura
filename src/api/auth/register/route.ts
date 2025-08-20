
'use server';

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId, findHospitalById, findHospitalByCode, createSubscription } from "@/services/user-service";
import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";
import * as brevo from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { OnboardingEmail } from "@/components/emails/OnboardingEmail";

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

let apiInstance: brevo.TransactionalEmailsApi | null = null;
if (process.env.BREVO_API_KEY) {
  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

const getAuthenticatedProfessional = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    const userEmailFromHeader = req.headers.get('X-User-Email');

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                return { id: decoded.userId, role: decoded.role };
            } catch (e) {
                console.error("Token decoding failed", e);
                return null;
            }
        }
    }

    if (userEmailFromHeader) {
        console.warn("Using X-User-Email header for auth. This should be deprecated.");
        if (userEmailFromHeader === 'admin@babyaura.in') {
            return { id: "HOSP-ID-FROM-ADMIN-SESSION", role: 'Admin' };
        }
        if (userEmailFromHeader === 'doctor@babyaura.in') {
            return { id: "d1", role: 'Doctor' };
        }
    }
    
    return null; 
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, email, password, role, registeredBy, hospitalCode, planId, ...rest } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }
    
    if(role === 'Parent' && !rest.babyName) {
         return NextResponse.json(
            { message: "Baby's name is required for parent registration." },
            { status: 400 }
        );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    let hospitalId;
    let doctorId;
    let hospitalData;

    if (registeredBy === 'Doctor' || registeredBy === 'Admin') {
        const professional = await getAuthenticatedProfessional(req);
        if (!professional) {
             return NextResponse.json({ message: "Professional user session not found." }, { status: 403 });
        }

        if(professional.role === 'Doctor') {
            hospitalData = await getHospitalByDoctorId(professional.id);
            if (hospitalData) {
                hospitalId = hospitalData._id;
                doctorId = professional.id; 
            }
        } else { 
            // If role is Admin, the professional.id from token IS the hospitalId
            hospitalId = professional.id;
            hospitalData = await findHospitalById(hospitalId);
        }

        if (!hospitalId) {
            return NextResponse.json({ message: "Could not find the hospital associated with this professional." }, { status: 400 });
        }
    } 
    else if (role === 'Parent' && hospitalCode) {
        hospitalData = await findHospitalByCode(hospitalCode);
        if(hospitalData) {
            hospitalId = hospitalData._id;
        } else {
             return NextResponse.json({ message: "Invalid hospital code provided." }, { status: 400 });
        }
    }
    else if (role === 'Parent' && !hospitalId) {
        if(!rest.phone || !rest.address) {
             return NextResponse.json(
                { message: "Phone number and address are required for independent registration." },
                { status: 400 }
            );
        }
    }

    const newUser = await createUser({ name, email, password, role, hospitalId, doctorId, ...rest });

    // If parent registers with a hospital plan, create subscription record
    if (role === 'Parent' && hospitalId && planId) {
        await createSubscription({
            parentId: newUser._id,
            hospitalId: hospitalId,
            planId: planId,
        });
    }

    // Send Welcome / Onboarding Email
    if (apiInstance) {
        let emailHtml: string;
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        if ((registeredBy === 'Admin' || registeredBy === 'Doctor') && newUser.role !== 'Admin') {
             emailHtml = render(OnboardingEmail({
                name: newUser.name, 
                role: newUser.role, 
                hospitalName: hospitalData?.hospitalName || 'your hospital', 
                temporaryPassword: password,
                email: newUser.email
            }));
            sendSmtpEmail.subject = `You've been invited to join BabyAura`;
        } else {
            emailHtml = render(WelcomeEmail({ name: newUser.name, role: newUser.role }));
            sendSmtpEmail.subject = `Welcome to BabyAura!`;
        }

        sendSmtpEmail.sender = { name: 'BabyAura', email: 'noreply@babyaura.in' };
        sendSmtpEmail.to = [{ email: newUser.email, name: newUser.name }];
        sendSmtpEmail.htmlContent = emailHtml;
        
        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch(e) {
            console.error("Failed to send welcome/onboarding email:", e);
            // Non-blocking error
        }
    }


    const { password: _, ...userWithoutPassword } = newUser;

    const token = jwt.sign(
        { 
            userId: userWithoutPassword._id, 
            role: userWithoutPassword.role, 
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
        }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '1h' }
    );

    return NextResponse.json({ token, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
