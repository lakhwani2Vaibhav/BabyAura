
import { NextRequest, NextResponse } from "next/server";
import { updateDoctor, deleteDoctor } from "@/services/user-service";

type RouteParams = {
    params: {
        doctorId: string
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { doctorId } = params;
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
