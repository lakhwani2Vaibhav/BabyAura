
import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminDashboardData } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const isSuperAdmin = (req: NextRequest): boolean => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    
    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.role === 'Superadmin';
    } catch(e) {
        return false;
    }
}

export async function GET(req: NextRequest) {
    try {
        if (!isSuperAdmin(req)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const dashboardData = await getSuperAdminDashboardData();
        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Failed to fetch superadmin dashboard data:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
