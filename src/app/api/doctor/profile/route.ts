'use server';

import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findDoctorById, updateDoctorProfile } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    role: string;
    [key: string]: any;
}

const getAuthenticatedDoctor = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Doctor' || !decoded.userId) return null;
        return findDoctorById(decoded.userId);
    } catch (e) {
        return null;
    }
};

export async function GET(req: NextRequest) {
    try {
        const doctor = await getAuthenticatedDoctor(req);
        if (!doctor) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }
        
        const { password, ...doctorWithoutPassword } = doctor;
        return NextResponse.json(doctorWithoutPassword);

    } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const doctor = await getAuthenticatedDoctor(req);
        if (!doctor) {
            return NextResponse.json({ message: "Authentication required." }, { status: 401 });
        }

        const body = await req.json();
        
        const allowedUpdates = ['name', 'specialty'];
        const updates: { [key: string]: any } = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }
        
        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: "No valid fields to update." }, { status: 400 });
        }


        await updateDoctorProfile(doctor._id, updates);
        
        const updatedDoctor = await findDoctorById(doctor._id);
        if (!updatedDoctor) throw new Error("Could not find updated doctor.");
        
        const { password: _, ...updatedData } = updatedDoctor;
        
        return NextResponse.json({ message: "Profile updated successfully.", updatedData });

    } catch (error) {
        console.error("Failed to update doctor profile:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
