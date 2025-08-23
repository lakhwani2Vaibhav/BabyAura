
import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/services/chat-service";
import { jwtDecode } from "jwt-decode";
import { findParentById, findDoctorById } from "@/services/user-service";

interface DecodedToken {
  userId: string;
  role: string;
}

const getAuthenticatedDoctorId = async (req: NextRequest): Promise<string | null> => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Doctor') return null;
        return decoded.userId;
    } catch (e) {
        return null;
    }
};

export async function POST(req: NextRequest) {
    try {
        const doctorId = await getAuthenticatedDoctorId(req);
        if (!doctorId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { content, receiverId } = body;

        if (!content || !receiverId) {
            return NextResponse.json({ message: "Content and receiver ID are required." }, { status: 400 });
        }

        // Verify receiver is a valid parent
        const parent = await findParentById(receiverId);
        if (!parent) {
            return NextResponse.json({ message: "Recipient parent not found." }, { status: 404 });
        }
        
        const newMessage = await createMessage({
            senderId: doctorId,
            receiverId: receiverId,
            senderRole: 'Doctor',
            content,
        });
        
        return NextResponse.json(newMessage, { status: 201 });

    } catch (error) {
        console.error("Failed to send message:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
