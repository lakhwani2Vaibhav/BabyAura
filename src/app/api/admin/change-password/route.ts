
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, changeAdminPassword } from "@/services/user-service";

const getAuthenticatedAdmin = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return null;
    const admin = await findUserByEmail(userEmail);
    return (admin && admin.role === 'Admin') ? admin : null;
};

export async function PUT(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Current and new passwords are required." }, { status: 400 });
        }
        
        await changeAdminPassword(admin._id, currentPassword, newPassword);
        
        return NextResponse.json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Failed to change password:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: (error as any).statusCode || 500 });
    }
}
