
import { NextRequest, NextResponse } from "next/server";
import { addMemberToTeam, findTeamById } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
}

type RouteParams = {
    params: {
        teamId: string
    }
}

const checkAdminPermission = async (req: NextRequest, teamId: string): Promise<boolean> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    
    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Admin') return false;

        const team = await findTeamById(teamId);
        return !!team && team.hospitalId === decoded.userId;
    } catch (e) {
        return false;
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { teamId } = params;
        const hasPermission = await checkAdminPermission(req, teamId);

        if (!hasPermission) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const { doctorId, role } = await req.json();
        if (!doctorId || !role) {
            return NextResponse.json({ message: "Doctor ID and role are required." }, { status: 400 });
        }

        const result = await addMemberToTeam(teamId, doctorId, role);
        if (!result.modifiedCount) {
             return NextResponse.json({ message: "Could not add member. Team not found or member already exists." }, { status: 400 });
        }

        return NextResponse.json({ message: "Member added successfully." }, { status: 200 });

    } catch (error: any) {
        console.error("Failed to add team member:", error);
        return NextResponse.json({ message: error.message || "An unexpected error occurred." }, { status: 500 });
    }
}
