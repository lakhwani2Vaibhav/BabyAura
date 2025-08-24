
import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";
import { findParentById, findTeamById, findDoctorById, createAppointment, getUpcomingAppointments } from "@/services/user-service";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  role: string;
}

const getAuthenticatedParent = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role !== 'Parent') return null;
        return findParentById(decoded.userId);
    } catch (e) {
        return null;
    }
};

export async function GET(req: NextRequest) {
    const parent = await getAuthenticatedParent(req);
    if (!parent) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let careTeam = [];

    if (parent.teamId) {
        const team = await findTeamById(parent.teamId);
        if (team) {
            const memberDetails = await Promise.all(
              team.members.map(async (member: any) => {
                const doctor = await findDoctorById(member.doctorId);
                return {
                    id: member.doctorId,
                    name: member.name,
                    type: member.role,
                    avatarUrl: 'https://placehold.co/100x100.png',
                    languages: ['English', 'Hindi'],
                    experience: '10+ years',
                    notes: `Specializes in ${member.role}.`,
                    pastAppointments: []
                };
              })
            );
            careTeam = memberDetails;
        }
    } else if (parent.doctorId) {
        const doctor = await findDoctorById(parent.doctorId);
        if (doctor) {
             careTeam.push({
                id: doctor._id,
                name: doctor.name,
                type: doctor.specialty,
                avatarUrl: 'https://placehold.co/100x100.png',
                languages: ['English', 'Hindi'],
                experience: '12 years',
                notes: 'Specializes in newborn care and developmental milestones.',
                pastAppointments: []
            });
        }
    }

    const upcomingConsultations = await getUpcomingAppointments(parent._id, 'Parent');

    const responseData = {
        upcomingConsultations,
        careTeam: careTeam,
    }

    return NextResponse.json(responseData);
}

export async function POST(req: NextRequest) {
    const parent = await getAuthenticatedParent(req);
    if (!parent) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { doctorId, date, time } = body;

        if (!doctorId || !date || !time) {
            return NextResponse.json({ message: "Missing required appointment details." }, { status: 400 });
        }

        const appointment = await createAppointment({
            parentId: parent._id,
            doctorId,
            appointmentDate: new Date(`${date}T${time}`),
            date,
            time,
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error("Failed to create appointment:", error);
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
}
