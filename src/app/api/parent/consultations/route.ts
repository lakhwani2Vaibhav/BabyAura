import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";
import { findParentById, findTeamById, findDoctorById } from "@/services/user-service";
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


// This is a mock API endpoint. In a real application, you would fetch this data from your database
// based on the authenticated parent's ID.

const mockData = {
  // We will return empty upcoming consultations for now
  // as this feature is not fully implemented.
  upcomingConsultations: [
    // {
    //   id: 1,
    //   doctor: "Dr. Emily Carter",
    //   specialty: "Pediatrician",
    //   date: addDays(new Date(), 3).toISOString(),
    //   time: "10:00 AM",
    //   status: "Upcoming" as const,
    // },
    // {
    //   id: 2,
    //   doctor: "Dr. Ben Adams",
    //   specialty: "Nutritionist",
    //   date: addDays(new Date(), 10).toISOString(),
    //   time: "02:30 PM",
    //   status: "Upcoming" as const,
    // },
  ],
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
                    calendlyLink: doctor?.calendlyLink,
                    // These are mock details, in a real app you'd fetch them
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
        // Fallback for single doctor assignment if teams are not used
        const doctor = await findDoctorById(parent.doctorId);
        if (doctor) {
             careTeam.push({
                id: doctor._id,
                name: doctor.name,
                type: doctor.specialty,
                calendlyLink: doctor.calendlyLink,
                avatarUrl: 'https://placehold.co/100x100.png',
                languages: ['English', 'Hindi'],
                experience: '12 years',
                notes: 'Specializes in newborn care and developmental milestones.',
                pastAppointments: []
            });
        }
    }


    const responseData = {
        ...mockData,
        careTeam: careTeam,
    }


    return NextResponse.json(responseData);
}
