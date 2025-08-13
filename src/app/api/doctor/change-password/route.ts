
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, changeDoctorPassword } from "@/services/user-service";

const getAuthenticatedDoctor = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return null;
    const doctor = await findUserByEmail(userEmail);
    return (doctor && doctor.role === 'Doctor') ? doctor : null;
};

export async function PUT(req: NextRequest) {
    try {
        const doctor = await getAuthenticatedDoctor(req);
        if (!doctor) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Current and new passwords are required." }, { status: 400 });
        }
        
        await changeDoctorPassword(doctor._id, currentPassword, newPassword);
        
        return NextResponse.json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Failed to change password:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: (error as any).statusCode || 500 });
    }
}
