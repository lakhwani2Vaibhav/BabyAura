
import { NextRequest, NextResponse } from "next/server";
import { getAdminDashboardData } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const getAuthenticatedAdminHospitalId = (req: NextRequest): string | null => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Admin') return null;
        // An Admin's userId in the token IS the hospitalId
        return decoded.userId; 
    } catch (e) {
        console.error("JWT decoding error:", e);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const hospitalId = getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated or hospital ID missing." }, { status: 403 });
        }
        
        const dashboardData = await getAdminDashboardData(hospitalId);
        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
