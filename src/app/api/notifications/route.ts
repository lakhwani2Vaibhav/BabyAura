
import { NextRequest, NextResponse } from "next/server";
import { getNotificationsForUser } from "@/services/notification-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role: string;
  [key: string]: any;
}

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded.userId;

        const notifications = await getNotificationsForUser(userId);

        return NextResponse.json(notifications);

    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
