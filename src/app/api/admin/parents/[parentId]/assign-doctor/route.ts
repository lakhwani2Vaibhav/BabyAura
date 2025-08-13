
import { NextRequest, NextResponse } from "next/server";
import { assignDoctorToParent, findParentById, findDoctorById } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

type RouteParams = {
    params: {
        parentId: string
    }
}

const checkAdminPermission = async (req: NextRequest, parentId: string, doctorId: string): Promise<string | null> => {
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
        
        const doctor = await findDoctorById(doctorId);
        if (!doctor || doctor.hospitalId !== hospitalId) return null;

        return hospitalId;
    } catch(e) {
        return null;
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
     try {
        const { parentId } = params;
        const { doctorId } = await req.json();

        if (!doctorId) {
            return NextResponse.json({ message: "Doctor ID is required." }, { status: 400 });
        }
        
        const hospitalId = await checkAdminPermission(req, parentId, doctorId);
        if (!hospitalId) {
             return NextResponse.json({ message: "Forbidden: You do not have permission to perform this action." }, { status: 403 });
        }
        
        await assignDoctorToParent(parentId, doctorId);
        
        return NextResponse.json({ message: "Doctor assigned successfully." });

    } catch (error) {
        console.error("Failed to assign doctor:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
