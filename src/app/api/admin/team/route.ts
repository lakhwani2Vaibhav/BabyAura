
import { NextRequest, NextResponse } from "next/server";
import { getTeamsByHospital, createTeam } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const getAuthenticatedAdminHospitalId = async (req: NextRequest): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.role === 'Admin' ? decoded.userId : null;
    } catch (e) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated." }, { status: 403 });
        }
        
        const teams = await getTeamsByHospital(hospitalId);
        return NextResponse.json(teams);

    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated." }, { status: 403 });
        }
        
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ message: "Team name is required." }, { status: 400 });
        }

        const newTeam = await createTeam(hospitalId, name);
        return NextResponse.json(newTeam, { status: 201 });

    } catch (error) {
        console.error("Failed to create team:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
