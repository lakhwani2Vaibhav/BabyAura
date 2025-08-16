
import { NextRequest, NextResponse } from "next/server";
import { createMessage, getMessagesForConversation } from "@/services/chat-service";
import { jwtDecode } from "jwt-decode";
import { findParentById, findDoctorById } from "@/services/user-service";

interface DecodedToken {
  userId: string;
  role: string;
}

const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Parent') return null;
        return decoded.userId;
    } catch (e) {
        return null;
    }
};

// Get messages for a conversation
export async function GET(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { searchParams } = new URL(req.url);
        const specialistId = searchParams.get('specialistId');
        if (!specialistId) {
            return NextResponse.json({ message: "Specialist ID is required." }, { status: 400 });
        }

        const messages = await getMessagesForConversation(parentId, specialistId);
        
        return NextResponse.json(messages);

    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

// Send a new message
export async function POST(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { content, receiverId } = body;

        if (!content || !receiverId) {
            return NextResponse.json({ message: "Content and receiver ID are required." }, { status: 400 });
        }

        const newMessage = await createMessage({
            senderId: parentId,
            receiverId: receiverId,
            senderRole: 'Parent',
            content,
        });
        
        return NextResponse.json(newMessage, { status: 201 });

    } catch (error) {
        console.error("Failed to send message:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
