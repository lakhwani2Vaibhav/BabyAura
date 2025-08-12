import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, ...rest } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required." },
        { status: 400 }
      );
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
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
