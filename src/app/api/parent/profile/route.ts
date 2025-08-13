
import { NextRequest, NextResponse } from "next/server";
import { findParentById, updateParentProfile, findUserByEmail } from "@/services/user-service";

// This function now dynamically gets the user's email from the request headers,
// simulating a real authentication session.
const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    // In a real app, you would decode a secure JWT from the Authorization header.
    // For this demo, we are passing the email in a custom header.
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) {
        return null;
    }
    const parent = await findUserByEmail(userEmail);
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
        
        const updatedParent = await findParentById(parentId);
        const { password: _, ...updatedData } = updatedParent;
        
        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No changes were made.", updatedData });
        }
        
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update parent profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
