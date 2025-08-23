
import { NextRequest, NextResponse } from "next/server";
import { createMessage, getMessagesForConversation, getParentRecentChats } from "@/services/chat-service";
import { jwtDecode } from "jwt-decode";
import { findParentById, findDoctorById } from "@/services/user-service";

interface DecodedToken {
  userId: string;
  role: string;
}

const getAuthenticatedUser = async (req: NextRequest): Promise<{ userId: string, role: string } | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (!decoded.userId || !decoded.role) return null;
        return { userId: decoded.userId, role: decoded.role };
    } catch (e) {
        return null;
    }
};

// Get messages for a conversation
export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { searchParams } = new URL(req.url);
        const otherUserId = searchParams.get('specialistId');
        
        if (otherUserId) {
            const messages = await getMessagesForConversation(user.userId, otherUserId);
            return NextResponse.json(messages);
        }

        // If no specialistId, assume we're fetching the recent chats list for the parent
        if (user.role === 'Parent') {
            const recentChats = await getParentRecentChats(user.userId);
            return NextResponse.json(recentChats);
        }

        return NextResponse.json({ message: "Invalid request." }, { status: 400 });

    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

// Send a new message
export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { content, receiverId } = body;

        if (!content || !receiverId) {
            return NextResponse.json({ message: "Content and receiver ID are required." }, { status: 400 });
        }

        const newMessage = await createMessage({
            senderId: user.userId,
            receiverId: receiverId,
            senderRole: user.role as 'Parent' | 'Doctor', // Assuming only these roles can send messages via this endpoint
            content,
        });
        
        return NextResponse.json(newMessage, { status: 201 });

    } catch (error) {
        console.error("Failed to send message:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
