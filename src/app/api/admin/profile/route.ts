
import { NextRequest, NextResponse } from "next/server";
import { updateAdminProfile, findUserByEmail } from "@/services/user-service";

const getAuthenticatedAdmin = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return null;
    return await findUserByEmail(userEmail);
};

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin || admin.role !== 'Admin') {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { password, ...adminWithoutPassword } = admin;
        return NextResponse.json(adminWithoutPassword);

    } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin || admin.role !== 'Admin') {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: "Name is a required field." }, { status: 400 });
        }
        
        const updates: { name: string } = { name };

        await updateAdminProfile(admin._id, updates);
        
        const updatedAdmin = await findUserByEmail(admin.email);
        if (!updatedAdmin) throw new Error("Could not find updated admin.");

        const { password: _, ...updatedData } = updatedAdmin;
        
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update admin profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
