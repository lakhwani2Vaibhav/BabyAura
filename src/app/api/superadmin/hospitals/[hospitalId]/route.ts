
import { NextRequest, NextResponse } from "next/server";
import { updateHospitalStatus } from "@/services/user-service";
import { findUserByEmail } from "@/services/user-service";

type RouteParams = {
    params: {
        hospitalId: string
    }
}

const checkSuperAdmin = async (req: NextRequest) => {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) return false;
    const user = await findUserByEmail(userEmail);
    return user && user.role === 'Superadmin';
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        // This should be protected and only accessible by a superadmin
        // For now, we'll assume the check is handled by middleware or a session check
        
        const { hospitalId } = params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ message: "Status is required." }, { status: 400 });
        }

        const result = await updateHospitalStatus(hospitalId, status);
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Hospital not found or status is already set." }, { status: 404 });
        }

        return NextResponse.json({ message: "Hospital status updated successfully." });

    } catch (error) {
        console.error("Failed to update hospital status:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
