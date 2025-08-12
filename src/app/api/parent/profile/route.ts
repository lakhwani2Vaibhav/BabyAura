
import { NextRequest, NextResponse } from "next/server";
import { findParentById, updateParentProfile } from "@/services/user-service";

// This is a placeholder for getting the authenticated user's ID from a session/token.
const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
    // In a real app, you would decode a JWT or look up a session.
    // For this demo, we'll find the seeded parent user and return their ID.
    // This is NOT secure and for demonstration purposes only.
    const parent = await db.collection('parents').findOne({ email: 'parent@babyaura.in' });
    return parent ? parent._id : null;
};

import { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";

let client;
let db: Db;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();


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
            return NextResponse.json({ message: "Profile not found or no changes were made." }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Profile updated successfully." });

    } catch (error) {
        console.error("Failed to update parent profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
