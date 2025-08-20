
import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePlan, getPlansByHospital } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
}

const getAuthenticatedAdminHospitalId = async (req: NextRequest): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.role === 'Admin' ? decoded.userId : null;
    } catch (e) {
        return null;
    }
}


export async function GET(req: NextRequest) {
    try {
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated." }, { status: 403 });
        }
        
        const plans = await getPlansByHospital(hospitalId);
        return NextResponse.json(plans);

    } catch (error) {
        console.error("Failed to fetch plans:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const hospitalId = await getAuthenticatedAdminHospitalId(req);
        if (!hospitalId) {
            return NextResponse.json({ message: "Admin not authenticated." }, { status: 403 });
        }

        const planData = await req.json();

        // Basic validation
        if (!planData.planName || planData.monthlyPrice === undefined) {
             return NextResponse.json({ message: "Plan name and price are required." }, { status: 400 });
        }

        await createOrUpdatePlan(hospitalId, planData);

        return NextResponse.json({ message: "Plan saved successfully." }, { status: 200 });
    } catch (error) {
        console.error("Failed to save plan:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
