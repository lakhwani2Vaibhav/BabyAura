import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, seedUsers } from "@/services/user-service";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    // Seed initial users if they don't exist, for demo purposes.
    await seedUsers();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }
    
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }
    
    // Check if user has a password. Some documents (e.g. hospitals) might not be users.
    if (!user.password) {
        return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Return user info (excluding password) upon successful login
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
