
import { addDays, format, subDays, subMonths } from "date-fns";

export const parentData = {
  babyName: "Aura",
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
  pastConsultations: [
    {
      id: 3,
      doctor: "Dr. Emily Carter",
      specialty: "Pediatrician",
      date: subDays(new Date(), 30).toISOString(),
      time: "11:00 AM",
      status: "Past" as const,
    },
  ],
  vaccinationStatus: {
    next: {
      id: 'v-next',
      name: "Hepatitis B (3rd dose)",
      date: addDays(new Date(), 60).toISOString(),
      age: "6 Months",
    },
    history: [
      {
        id: "v1",
        name: "BCG",
        date: subDays(new Date(), 90).toISOString(),
        age: "Birth",
      },
      {
        id: "v2",
        name: "OPV-0",
        date: subDays(new Date(), 90).toISOString(),
        age: "Birth",
      },
      {
        id: "v3",
        name: "Hepatitis B - 1",
        date: subDays(new Date(), 90).toISOString(),
        age: "Birth",
      },
    ],
  },
  growthData: {
    weight: [
      { month: "Jan", weight: 3.5 },
      { month: "Feb", weight: 4.2 },
      { month: "Mar", weight: 5.1 },
      { month: "Apr", weight: 5.9 },
      { month: "May", weight: 6.5 },
      { month: "Jun", weight: 7.0 },
    ],
    height: [
      { month: "Jan", height: 50 },
      { month: "Feb", height: 54 },
      { month: "Mar", height: 57 },
      { month: "Apr", height: 60 },
      { month: "May", height: 63 },
      { month: "Jun", height: 65 },
    ],
  },
  healthReports: [
    {
      id: 1,
      name: "3-Month Well-Baby Visit Summary",
      doctor: "Dr. Emily Carter",
      date: format(subDays(new Date(), 90), "MMMM d, yyyy"),
    },
    {
      id: 2,
      name: "Initial Nutrition Plan",
      doctor: "Dr. Ben Adams",
      date: format(subDays(new Date(), 85), "MMMM d, yyyy"),
    },
  ],
};

export const careArticles = [
  {
    id: 1,
    title: "Understanding Your Baby's Sleep Patterns",
    description: "Learn about newborn sleep cycles and how to establish healthy sleep habits.",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 2,
    title: "A Guide to Introducing Solid Foods",
    description: "Find out when and how to start your baby on solid foods, with tips for success.",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 3,
    title: "Milestones: Your Baby's First Year",
    description: "Track the exciting developmental milestones to watch for in the first 12 months.",
    imageUrl: "https://placehold.co/600x400.png",
  },
];

export const communityPosts = [
  {
    id: 1,
    author: { name: "Jessica M.", avatarUrl: "https://placehold.co/40x40.png" },
    timestamp: "2 hours ago",
    content: "Any tips for dealing with teething? My little one is having such a tough time! 😢",
    likes: 15,
    comments: 8,
  },
  {
    id: 2,
    author: { name: "David L.", avatarUrl: "https://placehold.co/40x40.png" },
    timestamp: "1 day ago",
    content: "We just had our 4-month check-up and everything is looking great! So proud of this little guy.",
    likes: 32,
    comments: 4,
  },
];


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

const doctorPatients = [
  { id: 'p1', name: 'Baby Smith', lastVisit: subDays(new Date(), 10).toISOString(), status: 'Active' as const },
  { id: 'p2', name: 'Baby Jones', lastVisit: subDays(new Date(), 25).toISOString(), status: 'Active' as const },
  { id: 'p3', name: 'Baby Williams', lastVisit: subDays(new Date(), 5).toISOString(), status: 'Active' as const },
  { id: 'p4', name: 'Baby Brown', lastVisit: subDays(new Date(), 90).toISOString(), status: 'Inactive' as const },
  { id: 'p5', name: 'Baby Garcia', lastVisit: subDays(new Date(), 15).toISOString(), status: 'Active' as const },
];

export const doctorData = {
    patients: doctorPatients,
    todaysConsultations: [
        { id: 101, patientName: "Baby Smith", time: "09:30 AM", reason: "Fever" },
        { id: 102, patientName: "Baby Jones", time: "11:00 AM", reason: "Routine Check-up" },
        { id: 103, patientName: "Baby Williams", time: "01:15 PM", reason: "Rash" },
    ],
    prescriptions: [
      { id: 'rx1', patientName: 'Baby Smith', medication: 'Amoxicillin 250mg/5ml', dateIssued: subDays(new Date(), 2).toISOString(), status: 'Active' as const },
      { id: 'rx2', patientName: 'Baby Williams', medication: 'Infant Tylenol', dateIssued: subDays(new Date(), 5).toISOString(), status: 'Active' as const },
      { id: 'rx3', patientName: 'Baby Brown', medication: 'Nystatin Cream', dateIssued: subDays(new Date(), 30).toISOString(), status: 'Expired' as const },
    ],
    earnings: {
        total: 75430,
        thisMonth: 9800,
        avgPerConsultation: 75,
        history: [
            { month: "Jan", revenue: 8000 },
            { month: "Feb", revenue: 9200 },
            { month: "Mar", revenue: 8500 },
            { month: "Apr", revenue: 11000 },
            { month: "May", revenue: 9500 },
            { month: "Jun", revenue: 9800 },
        ],
        payouts: [
            { id: 1, date: format(subDays(new Date(), 15), "MMMM d, yyyy"), amount: 4500, status: 'Paid' },
            { id: 2, date: format(subDays(new Date(), 45), "MMMM d, yyyy"), amount: 5200, status: 'Paid' },
        ]
    }
};

export const adminData = {
    metrics: {
        doctors: 12,
        parents: 256,
        activeSubscriptions: 240,
    },
    doctors: [
        { id: 'd1', name: 'Dr. Emily Carter', specialty: 'Pediatrics', patients: 150, status: 'Active' as const, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: 'd2', name: 'Dr. Ben Adams', specialty: 'Nutrition', patients: 80, status: 'Active' as const, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: 'd3', name: 'Dr. Sarah Lee', specialty: 'Pediatrics', patients: 26, status: 'On Leave' as const, avatarUrl: 'https://placehold.co/40x40.png' },
    ],
     patients: [
      { id: 'p1', name: 'Baby Smith', assignedDoctor: 'Dr. Emily Carter', lastVisit: subDays(new Date(), 10).toISOString(), status: 'Active' as const, avatarUrl: 'https://placehold.co/40x40.png' },
      { id: 'p2', name: 'Baby Jones', assignedDoctor: 'Dr. Emily Carter', lastVisit: subDays(new Date(), 25).toISOString(), status: 'Active' as const, avatarUrl: 'https://placehold.co/40x40.png' },
      { id: 'p3', name: 'Baby Williams', assignedDoctor: 'Dr. Sarah Lee', lastVisit: subDays(new Date(), 5).toISOString(), status: 'Active' as const, avatarUrl: 'https://placehold.co/40x40.png' },
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
    ],
    hospitals: [
        { id: 'h1', name: 'General Hospital', joinedDate: subMonths(new Date(), 6).toISOString(), plan: 'Licensing', status: 'Active' as const },
        { id: 'h2', name: 'Central Pediatrics', joinedDate: subMonths(new Date(), 2).toISOString(), plan: 'Revenue Share', status: 'Active' as const },
        { id: 'h3', name: 'Lakeside Childrens', joinedDate: subMonths(new Date(), 12).toISOString(), plan: 'Licensing', status: 'Active' as const },
        { id: 'h4', name: 'Community Care', joinedDate: subMonths(new Date(), 1).toISOString(), plan: 'Revenue Share', status: 'Pending' as const },
    ],
    analytics: {
        totalHospitals: 34,
        totalUsers: 14800,
        platformMRR: 170000,
        growthRate: 12,
        monthlyRevenue: [
            { month: "Jan", revenue: 120000 },
            { month: "Feb", revenue: 130000 },
            { month: "Mar", revenue: 145000 },
            { month: "Apr", revenue: 155000 },
            { month: "May", revenue: 160000 },
            { month: "Jun", revenue: 170000 },
        ],
        userGrowth: [
            { month: "Jan", parents: 8000, doctors: 800 },
            { month: "Feb", parents: 9000, doctors: 850 },
            { month: "Mar", parents: 10500, doctors: 900 },
            { month: "Apr", parents: 12000, doctors: 950 },
            { month: "May", parents: 13000, doctors: 1000 },
            { month: "Jun", parents: 14800, doctors: 1100 },
        ]
    },
    platformLogs: [
        { id: 1, timestamp: new Date().toISOString(), user: 'superadmin@babyaura.com', action: 'LOGIN_SUCCESS', type: 'Authentication', details: 'User logged in successfully' },
        { id: 2, timestamp: subDays(new Date(), 1).toISOString(), user: 'admin@generalhospital.com', action: 'UPDATE_DOCTOR_PROFILE', type: 'API', details: 'Updated profile for Dr. Carter' },
        { id: 3, timestamp: subDays(new Date(), 2).toISOString(), user: 'system', action: 'PROCESS_PAYMENT', type: 'Billing', details: 'Processed payment for Central Pediatrics' },
    ]
};
