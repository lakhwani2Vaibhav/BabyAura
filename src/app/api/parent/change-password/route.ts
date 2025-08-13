
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, changeParentPassword } from "@/services/user-service";

const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return null;
    const parent = await findUserByEmail(userEmail);
    return parent ? parent._id : null;
};

export async function PUT(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Current and new passwords are required." }, { status: 400 });
        }
        
        await changeParentPassword(parentId, currentPassword, newPassword);
        
        return NextResponse.json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Failed to change password:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: (error as any).statusCode || 500 });
    }
}
