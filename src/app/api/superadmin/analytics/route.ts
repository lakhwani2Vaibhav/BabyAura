
import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminAnalytics } from "@/services/user-service";

// In a real app, this would be protected by the middleware.
// We'll assume the middleware has already validated the superadmin token.

export async function GET(req: NextRequest) {
    try {
        const analyticsData = await getSuperAdminAnalytics();
        return NextResponse.json(analyticsData);
    } catch (error) {
        console.error("Failed to fetch superadmin analytics:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
