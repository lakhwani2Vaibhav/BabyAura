
import { NextRequest, NextResponse } from "next/server";
import { findParentById, updateParentProfile, findUserByEmail } from "@/services/user-service";

// This is a placeholder for getting the authenticated user's ID from a session/token.
const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    // In a real app, you would decode a JWT or look up a session to get the user's email or ID.
    // For this demo, we'll find the seeded parent user and return their ID.
    // This is NOT secure and for demonstration purposes only.
    const parent = await findUserByEmail('parent@babyaura.in');
    return parent ? parent._id : null;
};


export async function GET(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const parent = await findParentById(parentId);
        if (!parent) {
            return NextResponse.json({ message: "Parent not found." }, { status: 404 });
        }
        
        const { password, ...userWithoutPassword } = parent;
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error("Failed to fetch parent profile:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        
        // Basic validation
        const { name, babyName, babyDob, password } = body;
        if (!name || !babyName || !babyDob) {
            return NextResponse.json({ message: "Name, baby name, and baby's DOB are required." }, { status: 400 });
        }

        const result = await updateParentProfile(parentId, { name, babyName, babyDob, password });
        if (result.modifiedCount === 0) {
            // Even if no data changed, we can return success, or a specific "no change" message.
            const updatedParent = await findParentById(parentId);
            const { password, ...updatedData } = updatedParent;
            return NextResponse.json({ message: "No changes were made.", updatedData });
        }
        
        const updatedParent = await findParentById(parentId);
        const { password: _, ...updatedData } = updatedParent;
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update parent profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
