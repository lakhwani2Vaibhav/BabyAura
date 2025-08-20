
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from 'jwt-decode';
import { findTeamById, deleteTeam } from "@/services/user-service";

interface DecodedToken {
    userId: string;
    role: string;
}

type RouteParams = {
    params: {
        teamId: string;
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


export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { teamId } = params;
        const hasPermission = await checkAdminPermission(req, teamId);

        if (!hasPermission) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const result = await deleteTeam(teamId);
        if (result.deletedCount === 0) {
             return NextResponse.json({ message: "Could not delete team. Team not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Team deleted successfully." }, { status: 200 });

    } catch (error: any) {
        console.error("Failed to delete team:", error);
        return NextResponse.json({ message: error.message || "An unexpected error occurred." }, { status: 500 });
    }
}
