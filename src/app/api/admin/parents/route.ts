
import { NextRequest, NextResponse } from "next/server";
import { getParentsByHospital } from "@/services/user-service";

// This is a placeholder for a secure session check.
// In a real app, this would involve decoding a JWT or similar.
const getAuthenticatedAdminHospitalId = async (req: NextRequest) => {
    // Placeholder logic: In a real scenario, decode a JWT or query a session store.
    // This is NOT secure for production. For demo purposes, we return a known ID.
    return "HOSP-ID-FROM-ADMIN-SESSION";
}

export async function GET(req: NextRequest) {
    try {
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated or hospital ID missing." }, { status: 403 });
        }
        
        const parents = await getParentsByHospital(hospitalId);
        return NextResponse.json(parents);

    } catch (error) {
        console.error("Failed to fetch parents:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
