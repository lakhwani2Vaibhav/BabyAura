
import { NextRequest, NextResponse } from "next/server";
import { getTimelineTasks, updateTimelineTasks } from "@/services/user-service";

// This is a placeholder for getting the authenticated user's ID from a session/token.
const getAuthenticatedParentId = async (req: NextRequest): Promise<string | null> => {
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

        const timeline = await getTimelineTasks(parentId);
        if (!timeline) {
            return NextResponse.json({ message: "Timeline not found." }, { status: 404 });
        }

        return NextResponse.json(timeline);

    } catch (error) {
        console.error("Failed to fetch timeline:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const parentId = await getAuthenticatedParentId(req);
        if (!parentId) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { tasks } = await req.json();
        if (!tasks || !Array.isArray(tasks)) {
            return NextResponse.json({ message: "Invalid 'tasks' payload." }, { status: 400 });
        }

        await updateTimelineTasks(parentId, tasks);
        
        return NextResponse.json({ message: "Timeline updated successfully." });

    } catch (error) {
        console.error("Failed to update timeline:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
