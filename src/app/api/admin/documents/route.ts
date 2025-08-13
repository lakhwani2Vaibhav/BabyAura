
import { NextRequest, NextResponse } from "next/server";
import { getDocumentsByHospitalId } from "@/services/document-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
}

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        
        const hospitalId = decoded.userId;
        const documents = await getDocumentsByHospitalId(hospitalId);

        return NextResponse.json({ documents });

    } catch (error) {
        console.error("Failed to fetch documents:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
