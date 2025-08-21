
import { NextRequest, NextResponse } from "next/server";
import { createBlogPost } from "@/services/blog-service";
import { v2 as cloudinary } from 'cloudinary';
import { jwtDecode } from "jwt-decode";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isSuperAdmin = (req: NextRequest): boolean => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];
    if (!token) return false;
    try {
        const decoded: { role: string } = jwtDecode(token);
        return decoded.role === 'Superadmin';
    } catch (e) {
        return false;
    }
};

export async function POST(req: NextRequest) {
    if (!isSuperAdmin(req)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const image = formData.get('image') as File;

        if (!title || !content || !author || !image) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        
        // Upload image to Cloudinary
        const imageBuffer = await image.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const dataUri = `data:${image.type};base64,${base64Image}`;

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'babyaura_blog',
        });

        const newPost = await createBlogPost({
            title,
            content,
            author,
            imageUrl: uploadResult.secure_url,
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Failed to create blog post:", error);
        return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
    }
}
