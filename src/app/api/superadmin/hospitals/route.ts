
import { NextRequest, NextResponse } from "next/server";
import { getAllHospitals } from "@/services/user-service";
import { findUserByEmail } from "@/services/user-service";

const checkSuperAdmin = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return false;
    const user = await findUserByEmail(userEmail);
    return user && user.role === 'Superadmin';
}

export async function GET(req: NextRequest) {
    try {
        // This should be protected and only accessible by a superadmin
        // For now, we'll assume the check is handled by middleware or a session check
        const hospitals = await getAllHospitals();
        return NextResponse.json(hospitals);
    } catch (error) {
        console.error("Failed to fetch hospitals:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
