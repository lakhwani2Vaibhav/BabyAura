
import { NextRequest, NextResponse } from "next/server";
import { findDoctorById, updateDoctor, deleteDoctor } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

type RouteParams = {
    params: {
        doctorId: string
    }
}

const hasPermission = async (req: NextRequest, doctorId: string): Promise<boolean> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    
    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
        const decoded: { userId: string, role: string } = jwtDecode(token);
        if (decoded.role !== 'Admin') return false;

        const doctor = await findDoctorById(doctorId);
        if (!doctor) return false; // Or allow if admin wants to see a doctor not in their hospital? For now, no.

        // Admin's userId is their hospitalId
        return doctor.hospitalId === decoded.userId;
    } catch(e) {
        return false;
    }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { doctorId } = params;
        const permission = await hasPermission(req, doctorId);
        if (!permission) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const doctor = await findDoctorById(doctorId);

        if (!doctor) {
            return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
        }

        return NextResponse.json(doctor);

    } catch (error) {
        console.error("Failed to fetch doctor:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { doctorId } = params;
        const permission = await hasPermission(req, doctorId);
        if (!permission) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        // Add validation here to ensure only allowed fields are updated
        const allowedUpdates: { [key: string]: any } = {};
        if (body.status) allowedUpdates.status = body.status;
        if (body.name) allowedUpdates.name = body.name;
        if (body.specialty) allowedUpdates.specialty = body.specialty;

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json({ message: "No valid fields to update." }, { status: 400 });
        }
        
        const result = await updateDoctor(doctorId, allowedUpdates);

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Doctor not found or no changes made." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Doctor updated successfully." });

    } catch (error) {
        console.error("Failed to update doctor:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: RouteParams) {
     try {
        const { doctorId } = params;
        const permission = await hasPermission(req, doctorId);
        if (!permission) {
             return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const result = await deleteDoctor(doctorId);

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Doctor deleted successfully." });

    } catch (error) {
        console.error("Failed to delete doctor:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
