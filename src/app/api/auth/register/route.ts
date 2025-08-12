import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, getHospitalByDoctorId } from "@/services/user-service";
import { getSession } from 'next-auth/react'; // This is a placeholder for server-side session logic

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
    
    // If an admin is creating a doctor, they won't pass their own hospitalId.
    // In a real app with proper session management, you'd get the admin's hospitalId from their session.
    // For now, we'll simulate this.
    // if (role === 'Doctor' && !rest.hospitalId) {
    //   // This is a placeholder. A real implementation would involve getting the logged-in admin's session.
    //   // const session = await getSession({ req });
    //   // if (session?.user?.role === 'Admin' && session.user.hospitalId) {
    //   //    rest.hospitalId = session.user.hospitalId;
    //   // } else {
    //   //    return NextResponse.json({ message: "Admin not authenticated or missing hospital ID." }, { status: 403 });
    //   // }
    // }

    // If a doctor is registering a parent
    if (role === 'Parent' && registeredBy === 'Doctor') {
        // In a real app, you would get the doctor's ID from their session
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

    const newUser = await createUser({ name, email, password, role, ...rest });

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
