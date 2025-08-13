
import { NextRequest, NextResponse } from "next/server";
import { changeParentPassword } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role: string;
}

const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Parent') return null;
        return decoded.userId;
    } catch (e) {
        return null;
    }
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
