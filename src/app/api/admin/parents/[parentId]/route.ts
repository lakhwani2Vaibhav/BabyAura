
import { NextRequest, NextResponse } from "next/server";
import { deleteParent, findParentById } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

type RouteParams = {
    params: {
        parentId: string
    }
}

const hasPermission = async (req: NextRequest, parentId: string): Promise<boolean> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    
    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
        const decoded: { userId: string, role: string } = jwtDecode(token);
        if (decoded.role !== 'Admin') return false;

        const parent = await findParentById(parentId);
        if (!parent) return false;

        // Admin's userId in their token is their hospitalId
        return parent.hospitalId === decoded.userId;
    } catch(e) {
        return false;
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
     try {
        const { parentId } = params;
        
        const permission = await hasPermission(req, parentId);
        if (!permission) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const result = await deleteParent(parentId);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Parent deleted successfully." });

    } catch (error) {
        console.error("Failed to delete parent:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
