
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findDoctorById, updateDoctorProfile } from "@/services/user-service";

const getAuthenticatedDoctor = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return null;
    return await findUserByEmail(userEmail);
};

export async function GET(req: NextRequest) {
    try {
        const doctor = await getAuthenticatedDoctor(req);
        if (!doctor || doctor.role !== 'Doctor') {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const fullProfile = await findDoctorById(doctor._id);
        if (!fullProfile) {
            return NextResponse.json({ message: "Doctor profile not found." }, { status: 404 });
        }
        
        const { password, ...doctorWithoutPassword } = fullProfile;
        return NextResponse.json(doctorWithoutPassword);

    } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const doctor = await getAuthenticatedDoctor(req);
        if (!doctor || doctor.role !== 'Doctor') {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { name, specialty } = body;
        if (!name || !specialty) {
            return NextResponse.json({ message: "Name and specialty are required." }, { status: 400 });
        }

        await updateDoctorProfile(doctor._id, { name, specialty });
        
        const updatedDoctor = await findDoctorById(doctor._id);
        if (!updatedDoctor) throw new Error("Could not find updated doctor.");
        
        const { password: _, ...updatedData } = updatedDoctor;
        
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update doctor profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
