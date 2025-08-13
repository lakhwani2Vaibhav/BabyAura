
import { NextRequest, NextResponse } from "next/server";
import { updateHospitalStatus, getHospitalDetails } from "@/services/user-service";
import { findUserByEmail } from "@/services/user-service";

type RouteParams = {
    params: {
        hospitalId: string
    }
}

const checkSuperAdmin = async (req: NextRequest) => {
    // This is a placeholder for real auth check from token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    // In a real app, you would decode the token and check the role
    return true; 
}


export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const isSuperAdmin = await checkSuperAdmin(req);
        if(!isSuperAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { hospitalId } = params;
        const hospitalDetails = await getHospitalDetails(hospitalId);

        if (!hospitalDetails) {
            return NextResponse.json({ message: "Hospital not found." }, { status: 404 });
        }
        
        return NextResponse.json(hospitalDetails);

    } catch (error) {
        console.error("Failed to fetch hospital details:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const isSuperAdmin = await checkSuperAdmin(req);
        if(!isSuperAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
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
