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
      name: "Hepatitis B (HepB)",
      date: addDays(new Date(), 60).toISOString(),
      age: "1-2 Months",
    },
    history: [
      {
        id: "v1",
        name: "BCG",
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
    author: "BabyAura Health Team",
  },
  {
    id: 2,
    title: "A Guide to Introducing Solid Foods",
    description: "Find out when and how to start your baby on solid foods, with tips for success.",
    imageUrl: "https://placehold.co/600x400.png",
    author: "BabyAura Health Team",
  },
  {
    id: 3,
    title: "Milestones: Your Baby's First Year",
    description: "Track the exciting developmental milestones to watch for in the first 12 months.",
    imageUrl: "https://placehold.co/600x400.png",
    author: "BabyAura Health Team",
  },
];

export const blogPosts = [
    {
        id: 1,
        slug: 'navigating-postpartum-the-fourth-trimester',
        title: "Navigating Postpartum: A Guide to the Fourth Trimester",
        author: "Dr. Emily Carter",
        date: "2024-07-10T00:00:00.000Z",
        imageUrl: "https://placehold.co/1200x600.png",
        content: `The "fourth trimester" is the 12-week period immediately after you've had your baby. It's a time of huge physical and emotional change for both you and your baby. Understanding these changes can help you navigate this special, and sometimes challenging, period with more confidence. Your body is recovering from childbirth, your hormones are fluctuating wildly, and you're learning to care for a brand new human being who is completely dependent on you.

One of the most important things to remember during this time is to be kind to yourself. It's okay to not have it all figured out. Rest when you can, accept help when it's offered, and focus on the two most important things: your recovery and bonding with your baby. This is not the time for worrying about a clean house or a gourmet meal. It's a time for healing, learning, and falling in love.`
    },
    {
        id: 2,
        slug: 'decoding-your-babys-cries',
        title: "Decoding Your Baby's Cries: What Are They Trying to Tell You?",
        author: "BabyAura Health Team",
        date: "2024-06-25T00:00:00.000Z",
        imageUrl: "https://placehold.co/1200x600.png",
        content: `A baby's cry is their primary form of communication. It can be distressing for parents, but learning to interpret different cries is a key part of the parenting journey. While it takes time, you'll soon become an expert in your baby's unique language. The most common reasons for crying are often referred to as the "Big Three": hunger, a dirty diaper, or sleepiness. Always check these first.

Beyond the basics, cries can also signal other needs. A high-pitched, intense cry might mean pain, perhaps from gas or teething. A whiny, fussy cry could indicate boredom or a need for comfort. A "neh" sound can signal hunger, while an "owh" sound might be tied to sleepiness. Pay attention to these subtle cues and your baby's body language. Over time, you'll learn to distinguish between a "pick me up" cry and an "I'm in pain" cry, strengthening your bond and making you a more responsive caregiver.`
    },
    {
        id: 3,
        slug: 'the-ultimate-guide-to-tummy-time',
        title: "The Ultimate Guide to Tummy Time",
        author: "Dr. Ben Adams",
        date: "2024-06-12T00:00:00.000Z",
        imageUrl: "https://placehold.co/1200x600.png",
        content: `Tummy time is crucial for your baby's development. It's the simple act of placing your baby on their stomach while they are awake and supervised. This activity helps them build the muscles in their neck, shoulders, and back, which are essential for milestones like rolling over, sitting up, and crawling. It also helps prevent flat spots from developing on the back of their head.

You can start tummy time from day one, beginning with very short sessions of just a minute or two, a few times a day. You can lay your baby on your chest or lap to start. As they get stronger, you can move to a play mat on the floor. Make it fun by getting down on their level, talking to them, and using engaging toys. The goal is to gradually work up to about 15-30 minutes of total tummy time per day by the time they are three months old. Remember, every little bit counts!`
    }
];

export const communityPosts = [
  {
    id: 1,
    author: { name: "Jessica M.", avatarUrl: "https://placehold.co/40x40.png", isDoctor: false },
    timestamp: "2 hours ago",
    content: "Any tips for dealing with teething? My little one is having such a tough time! 😢",
    likes: 15,
    comments: 8,
  },
  {
    id: 2,
    author: { name: "David L.", avatarUrl: "https://placehold.co/40x40.png", isDoctor: false },
    timestamp: "1 day ago",
    content: "We just had our 4-month check-up and everything is looking great! So proud of this little guy.",
    likes: 32,
    comments: 4,
  },
];

export const scrapbookMemories = [
  {
    id: 1,
    type: "image" as const,
    title: "First Smile",
    date: "2024-01-15T00:00:00.000Z",
    url: "https://placehold.co/600x400.png",
    dataAiHint: "baby smiling",
    caption:
      "That gummy smile just melts my heart! Soaking in these precious moments.",
    tags: ["firsts", "milestone", "happy"],
  },
  {
    id: 2,
    type: "video" as const,
    title: "First Steps",
    date: "2024-03-22T00:00:00.000Z",
    url: "https://placehold.co/600x400.png", // Placeholder for video thumbnail
    dataAiHint: "baby walking",
    caption:
      "Look who's on the move! A little wobbly but so determined. Go, baby, go!",
    tags: ["firsts", "milestone", "walking"],
  },
  {
    id: 3,
    type: "audio" as const,
    title: 'First Word ("Dada")',
    date: "2024-04-10T00:00:00.000Z",
    url: "", // No visual for audio
    dataAiHint: "baby talking",
    caption: "And the first word is... Dada! Of course. My heart just exploded.",
    tags: ["firsts", "milestone", "talking"],
  },
  {
    id: 4,
    type: "image" as const,
    title: "Visit to Grandma's",
    date: "2024-05-01T00:00:00.000Z",
    url: "https://placehold.co/600x400.png",
    dataAiHint: "baby grandmother",
    caption: "Meeting the great-grandma. So much love in one photo.",
    tags: ["family", "grandma"],
  },
  {
    id: 5,
    type: "image" as const,
    title: "First Birthday",
    date: "2024-12-05T00:00:00.000Z",
    url: "https://placehold.co/600x400.png",
    dataAiHint: "baby birthday",
    caption:
      "One year of pure joy! We celebrated with a cake smash and lots of cuddles.",
    tags: ["birthday", "celebration", "family"],
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
    revenue: {
      today: 225,
      thisWeek: 1250,
    },
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
        monthlyRevenue: 12000,
        churnRate: "2.5%",
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

export const endorsements = [
    {
      name: 'IIIT Bangalore',
      description: 'Digital Health Initiatives',
      type: 'academic' as const,
    },
    {
      name: 'Wadhwani Foundation',
      description: 'Liftoff Program',
      type: 'foundation' as const,
    },
    {
      name: 'Dr. Devanand Kolothodi',
      description: 'Advisor, Fmr. Regional CEO, Aster DM Healthcare',
      type: 'advisor' as const,
    },
];

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "BabyAura has been a lifesaver! The 24/7 pediatrician support gave me peace of mind during those late-night fever scares. It's like having a doctor in your pocket.",
    childAge: '6 month',
  },
  {
    id: 2,
    name: 'Anjali Mehta',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "I love the growth tracker and milestone alerts. It's so rewarding to see my baby's progress, and the app makes it easy to share with our family.",
    childAge: '1 year',
  },
  {
    id: 3,
    name: 'Sneha Gupta',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "The AI-powered scrapbook is just magical. It helps me capture every little moment beautifully. I never thought I'd have such a well-organized baby book!",
    childAge: '9 month',
  },
  {
    id: 4,
    name: 'Deepika Reddy',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "As a first-time mom, the community forum has been my go-to. Getting advice from other parents who are going through the same thing is invaluable.",
    childAge: '4 month',
  },
  {
    id: 5,
    name: 'Fatima Khan',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "The vaccination reminders are a game-changer. I'm so forgetful with my busy schedule, but BabyAura keeps us on track with all the important shots.",
    childAge: '1.5 year',
  },
  {
    id: 6,
    name: 'Riya Singh',
    avatarUrl: 'https://placehold.co/48x48.png',
    dataAiHint: 'mother portrait',
    quote: "Finally, an app that understands what parents need. From health records to emergency support, it's the most comprehensive parenting app I've used. Highly recommend!",
    childAge: '2 year',
  },
];
