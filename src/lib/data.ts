import { addDays, format, subDays } from 'date-fns';

export const parentData = {
  babyName: "Aura",
  upcomingConsultations: [
    {
      id: 1,
      doctor: "Dr. Emily Carter",
      specialty: "Pediatrician",
      date: addDays(new Date(), 3).toISOString(),
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      doctor: "Dr. Ben Adams",
      specialty: "Nutritionist",
      date: addDays(new Date(), 10).toISOString(),
      time: "02:30 PM",
      status: "Upcoming",
    },
  ],
  vaccinationStatus: {
    next: {
      name: "Hepatitis B",
      date: addDays(new Date(), 60).toISOString(),
    },
    history: [
      { id: 'v1', name: 'BCG', date: subDays(new Date(), 90).toISOString() },
      { id: 'v2', name: 'OPV-0', date: subDays(new Date(), 90).toISOString() },
      { id: 'v3', name: 'Hepatitis B - 1', date: subDays(new Date(), 90).toISOString() },
    ]
  },
};

export const scrapbookMemories = [
  {
    id: 1,
    title: "First Smile",
    date: "2024-01-15T00:00:00.000Z",
    iconUrl: "https://placehold.co/48x48.png",
    dataAiHint: "baby smiling",
  },
  {
    id: 2,
    title: "First Steps",
    date: "2024-03-22T00:00:00.000Z",
    iconUrl: "https://placehold.co/48x48.png",
    dataAiHint: "baby walking",
  },
  {
    id: 3,
    title: "First Word",
    date: "2024-04-10T00:00:00.000Z",
    iconUrl: "https://placehold.co/48x48.png",
    dataAiHint: "baby talking",
  },
  {
    id: 4,
    title: "First Birthday",
    date: "2024-12-05T00:00:00.000Z",
    iconUrl: "https://placehold.co/48x48.png",
    dataAiHint: "baby birthday",
  },
  {
    id: 5,
    title: "First Day at School",
    date: "2025-09-02T00:00:00.000Z",
    iconUrl: "https://placehold.co/48x48.png",
    dataAiHint: "child school",
  },
];


export const doctorData = {
    todaysConsultations: [
        { id: 101, patientName: "Baby Smith", time: "09:30 AM", reason: "Fever" },
        { id: 102, patientName: "Baby Jones", time: "11:00 AM", reason: "Routine Check-up" },
        { id: 103, patientName: "Baby Williams", time: "01:15 PM", reason: "Rash" },
    ],
    revenue: {
        today: 450,
        thisWeek: 2300,
        thisMonth: 9800,
    }
};

export const adminData = {
    metrics: {
        doctors: 12,
        parents: 256,
        activeSubscriptions: 240,
    },
    doctors: [
        { id: 'd1', name: 'Dr. Emily Carter', specialty: 'Pediatrics', patients: 150 },
        { id: 'd2', name: 'Dr. Ben Adams', specialty: 'Nutrition', patients: 80 },
        { id: 'd3', name: 'Dr. Sarah Lee', specialty: 'Pediatrics', patients: 26 },
    ],
    revenueModel: "revenue-share" // or "licensing"
};


export const superAdminData = {
    metrics: {
        activeHospitals: 34,
        totalMRR: 170000,
        churnRate: "1.2%",
        userActivity: 12500 // e.g. daily active users
    },
    onboardingRequests: [
        { id: 'h1', name: 'City General Hospital', date: subDays(new Date(), 1).toISOString() },
        { id: 'h2', name: 'Sunrise Medical Center', date: subDays(new Date(), 3).toISOString() },
    ]
};
