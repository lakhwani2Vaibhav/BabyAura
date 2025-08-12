
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId, findHospitalById } from "@/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, email, password, role, registeredBy, hospitalId, ...rest } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }
    
    // If a doctor is registering a parent
    if (role === 'Parent' && registeredBy === 'Doctor') {
        const doctorId = 'd1'; // Placeholder for the logged-in doctor's ID
        const hospital = await getHospitalByDoctorId(doctorId);
        if (hospital) {
            rest.hospitalCode = hospital.hospitalCode;
        } else {
             return NextResponse.json(
                { message: "Could not find the hospital associated with the doctor." },
                { status: 400 }
            );
        }
    }

    // If an Admin is registering a parent
    if (role === 'Parent' && registeredBy === 'Admin') {
        if (!hospitalId) {
             return NextResponse.json({ message: "Admin must provide a hospital ID." }, { status: 400 });
        }
        const hospital = await findHospitalById(hospitalId);
        if (hospital) {
            rest.hospitalCode = hospital.hospitalCode;
        } else {
             return NextResponse.json({ message: "Could not find the hospital." }, { status: 400 });
        }
    }


    // For independent parents, certain fields are also required
    if (role === 'Parent' && !rest.hospitalCode) {
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
