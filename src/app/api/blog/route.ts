
import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/services/blog-service";

export async function GET(req: NextRequest) {
    try {
        const posts = await getAllBlogPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
