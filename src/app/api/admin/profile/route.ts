
import { NextRequest, NextResponse } from "next/server";
import { updateAdminProfile } from "@/services/user-service";

// This is a placeholder for a secure session check.
const getAuthenticatedAdminId = async (req: NextRequest) => {
    // In a real app, this would involve decoding a JWT or similar to get the user's ID.
    // For this demo, we'll return the ID of the seeded admin user.
    return "HOSP-ID-FROM-ADMIN-SESSION"; 
};

export async function PUT(req: NextRequest) {
    try {
        const adminId = await getAuthenticatedAdminId(req);
        if (!adminId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { name, password } = body;

        if (!name) {
            return NextResponse.json({ message: "Name is a required field." }, { status: 400 });
        }
        
        const updates: { name: string, password?: string } = { name };
        if (password) {
            updates.password = password;
        }

        const result = await updateAdminProfile(adminId, updates);

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Admin not found or no changes were made." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Profile updated successfully." });

    } catch (error) {
        console.error("Failed to update admin profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
