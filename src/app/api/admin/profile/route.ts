
import { NextRequest, NextResponse } from "next/server";
import { updateAdminProfile, findHospitalById } from "@/services/user-service";
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
        
        // We can update more fields now
        const allowedUpdates = [
            'hospitalName', 'mobile', 'email', 'address', 'specialties', 'emergencyContact', 'name'
        ];
        
        const updates: { [key: string]: any } = {};

        // Special handling for the owner's name which is in the `name` field in the form
        // but needs to be saved as `ownerName` in the database.
        if (body.name) {
            updates.ownerName = body.name;
        }

        for (const key of allowedUpdates) {
            if (body[key] !== undefined && key !== 'name') {
                updates[key] = body[key];
            }
        }
        
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: "No valid fields to update." }, { status: 400 });
        }

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
