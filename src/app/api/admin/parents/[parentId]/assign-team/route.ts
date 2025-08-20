
import { NextRequest, NextResponse } from "next/server";
import { assignTeamToParent, findParentById, findTeamById } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

type RouteParams = {
    params: {
        parentId: string
    }
}

const checkAdminPermission = async (req: NextRequest, parentId: string, teamId: string): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded: { userId: string, role: string } = jwtDecode(token);
        if (decoded.role !== 'Admin') return null;

        const hospitalId = decoded.userId;

        const parent = await findParentById(parentId);
        if (!parent || parent.hospitalId !== hospitalId) return null;
        
        const team = await findTeamById(teamId);
        if (!team || team.hospitalId !== hospitalId) return null;

        return hospitalId;
    } catch(e) {
        return null;
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
     try {
        const { parentId } = params;
        const { teamId } = await req.json();

        if (!teamId) {
            return NextResponse.json({ message: "Team ID is required." }, { status: 400 });
        }
        
        const hospitalId = await checkAdminPermission(req, parentId, teamId);
        if (!hospitalId) {
             return NextResponse.json({ message: "Forbidden: You do not have permission to perform this action." }, { status: 403 });
        }
        
        await assignTeamToParent(parentId, teamId);
        
        return NextResponse.json({ message: "Team assigned successfully." });

    } catch (error) {
        console.error("Failed to assign team:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
