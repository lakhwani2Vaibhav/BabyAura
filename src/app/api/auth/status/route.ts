
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, findDoctorById, findHospitalById } from "@/services/user-service";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role: string;
  email: string;
}

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        let user;
        
        if (decoded.role === 'Admin') {
            user = await findHospitalById(decoded.userId);
        } else if (decoded.role === 'Doctor') {
            user = await findDoctorById(decoded.userId);
            if (user && user.hospitalId) {
                // If doctor, check the hospital's status
                const hospital = await findHospitalById(user.hospitalId);
                if (hospital && (hospital.status === 'suspended' || hospital.status === 'rejected')) {
                     return NextResponse.json({ message: 'Access denied due to hospital suspension.' }, { status: 403 });
                }
            }
        } else {
            // For parents and superadmins, status is always considered active for this check.
            return NextResponse.json({ status: 'active' });
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        if (user.status === 'suspended' || user.status === 'rejected') {
            return NextResponse.json({ message: `Account is ${user.status}.` }, { status: 403 });
        }

        return NextResponse.json({ status: user.status });

    } catch (error) {
        console.error("Failed to check user status:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
