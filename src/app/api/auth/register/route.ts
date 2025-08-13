
'use server';

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId, findHospitalById, findHospitalByCode } from "@/services/user-service";

// This is a placeholder for a secure session check.
const getAuthenticatedProfessionalId = async (req: NextRequest) => {
    // In a real app, this would come from a decoded JWT in the Authorization header.
    // For now, we simulate different logged-in users.
    const userEmail = req.headers.get('X-User-Email');

    if (userEmail === 'admin@babyaura.in') {
        return "HOSP-ID-FROM-ADMIN-SESSION";
    }
    if (userEmail === 'doctor@babyaura.in') {
        return "d1";
    }
    
    return null; // No authenticated professional
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, email, password, role, registeredBy, hospitalCode, ...rest } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required." },
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
    let hospitalData;

    // Scenario 1: Registration is initiated by a logged-in professional (Admin or Doctor)
    if (registeredBy === 'Doctor' || registeredBy === 'Admin') {
        const professionalId = await getAuthenticatedProfessionalId(req);
        if (!professionalId) {
             return NextResponse.json({ message: "Professional user session not found." }, { status: 403 });
        }

        if(registeredBy === 'Doctor') {
            hospitalData = await getHospitalByDoctorId(professionalId);
        } else { // registeredBy is 'Admin'
            hospitalData = await findHospitalById(professionalId);
        }

        if (hospitalData) {
            hospitalId = hospitalData._id;
        } else {
             return NextResponse.json({ message: "Could not find the hospital associated with this professional." }, { status: 400 });
        }
    } 
    // Scenario 2: A parent self-registers using a hospital code
    else if (role === 'Parent' && hospitalCode) {
        hospitalData = await findHospitalByCode(hospitalCode);
        if(hospitalData) {
            hospitalId = hospitalData._id;
        } else {
             return NextResponse.json({ message: "Invalid hospital code provided." }, { status: 400 });
        }
    }
    // Scenario 3: A parent self-registers independently (requires phone and address)
    else if (role === 'Parent' && !hospitalId) {
        if(!rest.phone || !rest.address) {
             return NextResponse.json(
                { message: "Phone number and address are required for independent registration." },
                { status: 400 }
            );
        }
    }


    const newUser = await createUser({ name, email, password, role, hospitalId, ...rest });

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
