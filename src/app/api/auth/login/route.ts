import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, seedUsers } from "@/services/user-service";
import bcrypt from "bcrypt";
import type { UserRole } from "@/hooks/use-auth";

export async function POST(req: NextRequest) {
  try {
    // Seed initial users if they don't exist, for demo purposes.
    await seedUsers();

    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Email, password, and role are required." },
        { status: 400 }
      );
    }
    
    // For admin/superadmin, check if they are logging in via the correct, separate flow.
    // This is a placeholder for a future dedicated admin login page.
    // For now, we block them from the main login form.
    if (role === "Admin" || role === "Superadmin") {
      const user = await findUserByEmail(email);
      if (user) {
        // Here you might have a different logic path, e.g. checking a different flag
        // or just allowing it if we decide to have a unified login API.
        // For this implementation, we will assume admins will have a different portal/login page eventually.
      }
    }


    const user = await findUserByEmail(email);

    if (!user) {
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

    if (user.role !== role) {
        return NextResponse.json(
            { message: `You are not authorized to log in as a ${role}. Please select the correct role.` },
            { status: 403 }
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
