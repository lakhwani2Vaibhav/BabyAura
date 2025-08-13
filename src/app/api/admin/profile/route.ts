
import { NextRequest, NextResponse } from "next/server";
import { updateAdminProfile, findUserByEmail, findHospitalById } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const getAuthenticatedAdmin = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // For Admins, the userId in the token is the hospitalId
        if (decoded.role !== 'Admin' || !decoded.userId) return null;
        return findHospitalById(decoded.userId);
    } catch (e) {
        console.error("Token decoding error:", e);
        return null;
    }
};

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { password, ...adminWithoutPassword } = admin;
        return NextResponse.json(adminWithoutPassword);

    } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const admin = await getAuthenticatedAdmin(req);
        if (!admin) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ message: "Name is a required field." }, { status: 400 });
        }
        
        const updates: { name: string } = { name };

        await updateAdminProfile(admin._id, updates);
        
        const updatedAdmin = await findHospitalById(admin._id);
        if (!updatedAdmin) throw new Error("Could not find updated admin.");

        const { password: _, ...updatedData } = updatedAdmin;
        
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update admin profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

    