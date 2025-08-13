
import { NextRequest, NextResponse } from "next/server";
import { markNotificationsAsRead } from "@/services/notification-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded.userId;

        await markNotificationsAsRead(userId);

        return NextResponse.json({ message: "Notifications marked as read." });

    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
