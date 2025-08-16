import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, seedUsers } from "@/services/user-service";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
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
    
    const { password: _, ...userWithoutPassword } = user;

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

    return NextResponse.json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
