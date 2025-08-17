
import { NextRequest, NextResponse } from "next/server";
import { getParentDetailsForAdmin } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

type RouteParams = {
    params: {
        parentId: string
    }
}

const isSuperAdmin = (req: NextRequest): boolean => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
        const decoded: { role: string } = jwtDecode(token);
        return decoded.role === 'Superadmin';
    } catch(e) {
        return false;
    }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        if (!isSuperAdmin(req)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { parentId } = params;
        const parentDetails = await getParentDetailsForAdmin(parentId);

        if (!parentDetails) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }
        
        return NextResponse.json(parentDetails);

    } catch (error) {
        console.error("Failed to fetch parent details:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
