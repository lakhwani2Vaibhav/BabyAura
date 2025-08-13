
'use server';

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/services/user-service";

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

    // In a real app, we would now trigger the KYC process,
    // like sending an email to the superadmin for verification.

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
