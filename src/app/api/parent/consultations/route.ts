
import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";

// This is a mock API endpoint. In a real application, you would fetch this data from your database
// based on the authenticated parent's ID.

const mockData = {
  upcomingConsultations: [
    {
      id: 1,
      doctor: "Dr. Emily Carter",
      specialty: "Pediatrician",
      date: addDays(new Date(), 3).toISOString(),
      time: "10:00 AM",
      status: "Upcoming" as const,
    },
    {
      id: 2,
      doctor: "Dr. Ben Adams",
      specialty: "Nutritionist",
      date: addDays(new Date(), 10).toISOString(),
      time: "02:30 PM",
      status: "Upcoming" as const,
    },
  ],
  careTeam: [
    {
        id: 'd1', // Use the actual doctor ID
        name: 'Dr. Emily Carter',
        type: 'Pediatrician',
        avatarUrl: 'https://placehold.co/100x100.png',
        languages: ['English', 'Hindi'],
        experience: '12 years',
        notes: 'Specializes in newborn care and developmental milestones.',
        pastAppointments: [
            { date: '2024-07-15', notes: "Routine check-up. Baby is healthy.", prescription: "Vitamin D drops" },
            { date: '2024-06-10', notes: "Discussed feeding schedule.", prescription: null },
        ]
    },
    {
        id: 'd2',
        name: 'Dr. Ben Adams',
        type: 'Nutritionist',
        avatarUrl: 'https://placehold.co/100x100.png',
        languages: ['English'],
        experience: '8 years',
        notes: 'Focuses on infant and maternal nutrition.',
        pastAppointments: [
            { date: '2024-07-01', notes: "Introduced solid foods plan.", prescription: null }
        ]
    }
  ]
};

export async function GET(req: NextRequest) {
    // In a real app, you would use the token to identify the user
    // const token = req.headers.get('authorization');
    // const userId = getUserIdFromToken(token);
    // const data = await database.getConsultationsForUser(userId);

    return NextResponse.json(mockData);
}
