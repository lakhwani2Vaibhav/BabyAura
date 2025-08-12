
import { NextRequest, NextResponse } from "next/server";
import { getDoctorsByHospital } from "@/services/user-service";

// In a real app, you would get the admin's hospitalId from their session.
// For now, we will use a placeholder. This must be implemented securely.
const getHospitalIdFromSession = async (req: NextRequest) => {
    // Placeholder logic: In a real scenario, decode a JWT or query a session store.
    // This is NOT secure for production.
    return "HOSP-ID-FROM-ADMIN-SESSION";
}

export async function GET(req: NextRequest) {
    try {
        const hospitalId = await getHospitalIdFromSession(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated or hospital ID missing." }, { status: 403 });
        }
        
        const doctors = await getDoctorsByHospital(hospitalId);
        return NextResponse.json(doctors);

    } catch (error) {
        console.error("Failed to fetch doctors:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
