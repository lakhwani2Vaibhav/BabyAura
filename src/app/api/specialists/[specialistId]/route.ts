
import { NextRequest, NextResponse } from "next/server";
import { findDoctorById } from "@/services/user-service";

type RouteParams = {
    params: {
        specialistId: string;
    }
}

// In a real app, you would have a more robust way to get specialist details,
// perhaps from different collections (doctors, nutritionists, etc.).
// For this example, we'll primarily check the doctors collection.

export async function GET(req: NextRequest, { params }: RouteParams) {
    const { specialistId } = params;

    // Handle the static "Nurse Concierge" case
    if (specialistId === 'nurse-concierge') {
        return NextResponse.json({
            id: 'nurse-concierge',
            name: 'Nurse Concierge',
            avatarUrl: 'https://placehold.co/100x100.png',
        });
    }

    // Assume other specialists are doctors for now
    try {
        const doctor = await findDoctorById(specialistId);
        
        if (!doctor) {
            return NextResponse.json({ message: "Specialist not found" }, { status: 404 });
        }
        
        const specialistDetails = {
            id: doctor._id,
            name: doctor.name,
            avatarUrl: doctor.avatarUrl || 'https://placehold.co/100x100.png',
        };

        return NextResponse.json(specialistDetails);

    } catch (error) {
        console.error(`Failed to fetch specialist ${specialistId}:`, error);
        return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
    }
}
