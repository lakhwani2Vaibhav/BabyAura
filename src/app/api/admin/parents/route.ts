
import { NextRequest, NextResponse } from "next/server";
import { getParentsByHospital } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
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
        
        const parents = await getParentsByHospital(hospitalId);
        return NextResponse.json(parents);

    } catch (error) {
        console.error("Failed to fetch parents:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not fetch parent list.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
