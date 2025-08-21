
import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/services/blog-service";

type RouteParams = {
    params: {
        slug: string;
    }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = params;
        const post = await getBlogPostBySlug(slug);

        if (!post) {
            return NextResponse.json({ message: "Blog post not found." }, { status: 404 });
        }

        return NextResponse.json(post);

    } catch (error) {
        console.error("Failed to fetch blog post:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
