
import { NextRequest, NextResponse } from "next/server";
import { getDoctorsByHospital, findUserByEmail } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
    email: string;
    [key: string]: any;
}

const getAuthenticatedAdminHospitalId = async (req: NextRequest) => {
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
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated or hospital ID missing." }, { status: 403 });
        }
        
        const doctors = await getDoctorsByHospital(hospitalId);
        return NextResponse.json(doctors);

    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
