
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId, findHospitalById } from "@/services/user-service";
import { sendWelcomeEmail, sendOnboardingEmail } from "@/services/email-service";

// This is a placeholder for a secure session check.
const getAuthenticatedDoctorId = async (req: NextRequest) => {
    return 'd1';
}

const getAuthenticatedAdminHospitalId = async (req: NextRequest) => {
    return "HOSP-ID-FROM-ADMIN-SESSION";
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, email, password, role, registeredBy, ...rest } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }
    
    let hospitalId;
    let hospitalData;

    if (role === 'Parent' && registeredBy === 'Doctor') {
        const doctorId = await getAuthenticatedDoctorId(req);
        hospitalData = await getHospitalByDoctorId(doctorId);
        if (hospitalData) {
            hospitalId = hospitalData._id;
        } else {
             return NextResponse.json(
                { message: "Could not find the hospital associated with the doctor." },
                { status: 400 }
            );
        }
    }

    if (role === 'Parent' && registeredBy === 'Admin') {
        const adminHospitalId = await getAuthenticatedAdminHospitalId(req);
        hospitalData = await findHospitalById(adminHospitalId);
        if (hospitalData) {
            hospitalId = hospitalData._id;
        } else {
             return NextResponse.json({ message: "Could not find the hospital for this administrator." }, { status: 400 });
        }
    }
    
    if (role === 'Doctor' && registeredBy === 'Admin') {
        hospitalId = await getAuthenticatedAdminHospitalId(req);
        hospitalData = await findHospitalById(hospitalId);
    }

    if (role === 'Parent' && !rest.hospitalCode && !hospitalId) {
        if(!rest.phone || !rest.address) {
             return NextResponse.json(
                { message: "Phone number and address are required for independent registration." },
                { status: 400 }
            );
        }
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const newUser = await createUser({ name, email, password, role, hospitalId, ...rest });

    // Send relevant email after user is created
    if (registeredBy) {
        await sendOnboardingEmail({
            recipientEmail: newUser.email,
            recipientName: newUser.name,
            role: newUser.role,
            hospitalName: hospitalData?.hospitalName || "our partner hospital",
            temporaryPassword: password,
        });
    } else {
        await sendWelcomeEmail({
            recipientEmail: newUser.email,
            recipientName: newUser.name,
            role: newUser.role,
        });
    }

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
