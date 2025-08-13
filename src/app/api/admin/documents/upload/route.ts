
import { NextRequest, NextResponse } from "next/server";
import { updateDocumentStatus } from "@/services/document-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
}

export async function POST(req: NextRequest) {
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
        const { docId } = await req.json();

        if (!docId) {
            return NextResponse.json({ message: "Document ID is required." }, { status: 400 });
        }

        const result = await updateDocumentStatus(hospitalId, docId, 'Uploaded');
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Document not found or no changes needed." }, { status: 404 });
        }

        return NextResponse.json({ message: "Document status updated to 'Uploaded'." });

    } catch (error) {
        console.error("Failed to upload document:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
