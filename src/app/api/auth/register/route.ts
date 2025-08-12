
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId, findHospitalById } from "@/services/user-service";

// This is a placeholder for a secure session check.
// In a real app, this would involve decoding a JWT or similar.
const getAuthenticatedDoctorId = async (req: NextRequest) => {
    // For demo purposes, we'll return a static ID.
    // In a real app, you would get this from the user's session.
    // This is NOT secure for production.
    return 'd1';
}

const getAuthenticatedAdminHospitalId = async (req: NextRequest) => {
    // Placeholder logic for getting admin's hospitalId
    // In a real app, this would come from a secure session/token
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

    // If a doctor is registering a parent
    if (role === 'Parent' && registeredBy === 'Doctor') {
        const doctorId = await getAuthenticatedDoctorId(req);
        const hospital = await getHospitalByDoctorId(doctorId);
        if (hospital) {
            hospitalId = hospital._id;
        } else {
             return NextResponse.json(
                { message: "Could not find the hospital associated with the doctor." },
                { status: 400 }
            );
        }
    }

    // If an Admin is registering a parent
    if (role === 'Parent' && registeredBy === 'Admin') {
        const adminHospitalId = await getAuthenticatedAdminHospitalId(req);
        const hospital = await findHospitalById(adminHospitalId);
        if (hospital) {
            hospitalId = hospital._id;
        } else {
             return NextResponse.json({ message: "Could not find the hospital for this administrator." }, { status: 400 });
        }
    }
    
    // If an Admin is registering a Doctor
    if (role === 'Doctor' && registeredBy === 'Admin') {
        hospitalId = await getAuthenticatedAdminHospitalId(req);
    }


    // For independent parents, certain fields are also required
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

    // Pass all relevant data to createUser, including the determined hospitalId
    const newUser = await createUser({ name, email, password, role, hospitalId, ...rest });

    // Return user info (excluding password) upon successful registration
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
