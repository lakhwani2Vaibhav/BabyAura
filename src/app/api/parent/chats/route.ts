
import { NextRequest, NextResponse } from "next/server";
import { getParentRecentChats } from "@/services/chat-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    role: string;
}

const getAuthenticatedParentId = (req: NextRequest): string | null => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Parent') return null;
        return decoded.userId;
    } catch (e) {
        console.error("JWT decoding error:", e);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const parentId = getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Parent not authenticated." }, { status: 403 });
        }
        
        const recentChats = await getParentRecentChats(parentId);
        return NextResponse.json(recentChats);

    } catch (error) {
        console.error("Failed to fetch parent's recent chats:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
