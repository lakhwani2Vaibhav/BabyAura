
import { NextRequest, NextResponse } from "next/server";
import { getTimelineTasks, updateTimelineTasks } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";
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
