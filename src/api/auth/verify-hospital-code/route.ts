
import { NextRequest, NextResponse } from "next/server";
import { findHospitalByCode, getPlansByHospital } from "@/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const { hospitalCode } = await req.json();

    if (!hospitalCode) {
      return NextResponse.json(
        { message: "Hospital code is required." },
        { status: 400 }
      );
    }

    const hospital = await findHospitalByCode(hospitalCode.toUpperCase());

    if (!hospital) {
      return NextResponse.json(
        { message: "Invalid hospital code. Please check and try again." },
        { status: 404 }
      );
    }

    const plans = await getPlansByHospital(hospital._id);

    return NextResponse.json({ 
        hospitalName: hospital.hospitalName,
        plans: plans 
    }, { status: 200 });

  } catch (error) {
    console.error("Hospital code verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
