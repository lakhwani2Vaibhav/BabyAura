
import { NextRequest, NextResponse } from "next/server";
import { getDoctorDashboardData } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const getAuthenticatedDoctorId = (req: NextRequest): string | null => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Doctor') return null;
        return decoded.userId;
    } catch (e) {
        console.error("JWT decoding error:", e);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const doctorId = getAuthenticatedDoctorId(req);
        if (!doctorId) {
            return NextResponse.json({ message: "Doctor not authenticated." }, { status: 403 });
        }
        
        const dashboardData = await getDoctorDashboardData(doctorId);
        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Failed to fetch doctor dashboard data:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
