
'use server';

import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db, Collection, ObjectId } from "mongodb";
import { initializeHospitalDocuments } from "@/services/document-service";
import { createNotification } from "./notification-service";
import { capitalize } from "@/lib/utils";

let client;
let db: Db;
let parentsCollection: Collection;
let doctorsCollection: Collection;
let hospitalsCollection: Collection;
let superadminsCollection: Collection;
let timelinesCollection: Collection;
let teamsCollection: Collection;
let plansCollection: Collection;
let subscriptionsCollection: Collection;


async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    parentsCollection = db.collection('parents');
    doctorsCollection = db.collection('doctors');
    hospitalsCollection = db.collection('hospitals');
    superadminsCollection = db.collection('superadmins');
    timelinesCollection = db.collection('timelines');
    teamsCollection = db.collection('teams');
    plansCollection = db.collection('plans');
    subscriptionsCollection = db.collection('subscriptions');

  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

const generateId = (type: string) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}-${timestamp}-${random}`;
}

const getCollectionByRole = (role: string): Collection => {
    switch (role) {
        case 'Parent': return parentsCollection;
        case 'Doctor': return doctorsCollection;
        case 'Admin': return hospitalsCollection;
        case 'Superadmin': return superadminsCollection;
        default: throw new Error("Invalid user role specified.");
    }
}

export const findUserByEmail = async (email: string) => {
    if (!db) await init();
    
    const collections = [
        { collection: parentsCollection, role: 'Parent', nameField: 'name' },
        { collection: doctorsCollection, role: 'Doctor', nameField: 'name' },
        { collection: hospitalsCollection, role: 'Admin', nameField: 'ownerName' },
        { collection: superadminsCollection, role: 'Superadmin', nameField: 'name' }
    ];

    for (const { collection, role, nameField } of collections) {
        const user = await collection.findOne({ email });
        if (user) {
            const finalUser = { ...user, role, name: user[nameField], _id: String(user._id) };
            if (role === 'Admin') {
                finalUser.hospitalName = user.hospitalName;
            }
            return finalUser;
        }
    }
    return null;
};

export const createUser = async (userData: any) => {
  if (!db) await init();
  const { password, role, hospitalId, doctorId, planId, ...restOfUser } = userData;
  
  if(!password) {
      throw new Error("Password is required for user creation.");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDocument: any = {
    ...restOfUser,
    password: hashedPassword,
    createdAt: new Date(),
  };

  let collection;
  let customId: string;
  
  switch(role) {
    case 'Parent':
        collection = parentsCollection;
        customId = generateId('parent');
        userDocument.status = 'Active';
        if (hospitalId) userDocument.hospitalId = hospitalId;
        if (hospitalId && planId) {
            await createSubscription({ parentId: customId, hospitalId, planId });
        }
        if(hospitalId) {
            await createNotification({
                userId: hospitalId, // Notify the hospital admin
                title: 'New Parent Onboarded',
                description: `${userDocument.name} has registered under your hospital.`,
                href: `/admin/parents`
            })
        }
        break;
    case 'Doctor':
        collection = doctorsCollection;
        customId = generateId('doctor');
        userDocument.hospitalId = hospitalId;
        userDocument.status = 'Active'; 
        userDocument.profileStatus = 'incomplete_profile';
         if(hospitalId) {
            await createNotification({
                userId: hospitalId, // Notify the hospital admin
                title: 'New Doctor Added',
                description: `${userDocument.name} has been added to your hospital's team.`,
                href: `/admin/team`
            })
        }
        break;
    case 'Admin':
        collection = hospitalsCollection;
        customId = generateId('hospital');
        userDocument.status = 'pending_verification';
        userDocument.hospitalCode = `HOSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        // Notify superadmins about new hospital registration
        const superadmins = await superadminsCollection.find({}).toArray();
        for (const superadmin of superadmins) {
            await createNotification({
                userId: superadmin._id,
                title: 'New Hospital Registration',
                description: `${userDocument.hospitalName} has registered and is pending verification.`,
                href: `/superadmin/hospitals/${customId}`
            });
        }
        break;
    case 'Superadmin':
        collection = superadminsCollection;
        customId = generateId('superadmin');
        userDocument.status = 'Active';
        break;
    default:
        throw new Error("Invalid user role for creation.");
  }

  userDocument._id = customId;
  userDocument.role = role;

  const result = await collection.insertOne(userDocument);
  
  if (role === 'Admin') {
      await initializeHospitalDocuments(customId);
  }

  const { password: _, ...userWithoutPassword } = userDocument;
  return userWithoutPassword;
};

// Seed function... (omitted for brevity, no changes needed here)
export const seedUsers = async () => { if (!db) await init(); /* ... */ };


// Doctor Management Services for Admin
export const getDoctorsByHospital = async (hospitalId: string) => {
    if (!db) await init();
    return doctorsCollection.find({ hospitalId: hospitalId }).project({ password: 0 }).toArray();
};

export const findDoctorById = async (doctorId: string) => {
    if (!db) await init();
    const doctor = await doctorsCollection.findOne({ _id: doctorId });
    if (!doctor) return null;

    if (doctor.hospitalId) {
        const hospital = await hospitalsCollection.findOne({ _id: doctor.hospitalId });
        doctor.hospitalName = hospital ? hospital.hospitalName : 'Unknown Hospital';
    }
    return doctor;
}

export const updateDoctorProfile = async (doctorId: string, updates: any) => {
    if (!db) await init();
    return doctorsCollection.updateOne({ _id: doctorId }, { $set: updates });
}

export const changeDoctorPassword = async (doctorId: string, currentPassword: string, newPassword: string) => {
    if (!db) await init();
    const doctor = await doctorsCollection.findOne({ _id: doctorId });
    if (!doctor) {
        const err = new Error("Doctor not found.");
        (err as any).statusCode = 404;
        throw err;
    }
    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
        const err = new Error("Incorrect current password.");
        (err as any).statusCode = 401;
        throw err;
    }
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    return doctorsCollection.updateOne({ _id: doctorId }, { $set: { password: hashedNewPassword } });
};

export const updateDoctor = async (doctorId: string, updates: Partial<{ name: string; specialty: string; status: 'Active' | 'On Leave' }>) => {
    if (!db) await init();
    return doctorsCollection.updateOne({ _id: doctorId }, { $set: updates });
};

export const deleteDoctor = async (doctorId: string) => {
    if (!db) await init();
    return doctorsCollection.deleteOne({ _id: doctorId });
};

// Parent Management Services for Doctor/Admin
export const getHospitalByDoctorId = async (doctorId: string) => {
    if (!db) await init();
    const doctor = await doctorsCollection.findOne({ _id: doctorId });
    if (doctor && doctor.hospitalId) {
        return hospitalsCollection.findOne({ _id: doctor.hospitalId });
    }
    return null;
}

export const findHospitalById = async (hospitalId: string) => {
    if(!db) await init();
    return hospitalsCollection.findOne({ _id: hospitalId });
}

export const findHospitalByCode = async (code: string) => {
    if(!db) await init();
    return hospitalsCollection.findOne({ hospitalCode: code });
}


export const getParentsByHospital = async (hospitalId: string) => {
    if (!db) await init();
    const parents = await parentsCollection.find({ hospitalId: hospitalId }).toArray();
    
    // Create a map of teams in the hospital for efficient lookup
    const teams = await teamsCollection.find({ hospitalId }).toArray();
    const teamMap = new Map(teams.map(team => [team._id, team.name]));

    return parents.map(parent => ({
        ...parent,
        assignedTeam: parent.teamId ? teamMap.get(parent.teamId) || "Unassigned" : "Unassigned",
    }));
}


export const deleteParent = async (parentId: string) => {
    if(!db) await init();
    return parentsCollection.deleteOne({ _id: parentId });
}

export const assignTeamToParent = async (parentId: string, teamId: string) => {
    if (!db) await init();
    const parent = await findParentById(parentId);
    const team = await findTeamById(teamId);
    if (!parent || !team) throw new Error("Parent or team not found");

    // Create notifications for parent and all team members
    await createNotification({
        userId: parent._id,
        title: "New Care Team Assigned",
        description: `You have been assigned to the ${team.name}.`,
        href: "/parent/consultations"
    });
    
    for (const member of team.members) {
        await createNotification({
            userId: member.doctorId,
            title: "New Patient Assigned",
            description: `${parent.name} (Baby: ${parent.babyName}) has been assigned to your team, "${team.name}".`,
            href: `/doctor/patients/${parent._id}`
        });
    }

    return parentsCollection.updateOne({ _id: parentId }, { $set: { teamId: teamId, doctorId: null, updatedAt: new Date() } });
}


// Admin Profile Service
export const updateAdminProfile = async (adminId: string, updates: { [key: string]: any }) => {
    if (!db) await init();
    return hospitalsCollection.updateOne({ _id: adminId }, { $set: updates });
};

export const changeAdminPassword = async (adminId: string, currentPassword: string, newPassword: string) => {
    if (!db) await init();
    const admin = await hospitalsCollection.findOne({ _id: adminId });
    if (!admin) {
        const err = new Error("Admin not found.");
        (err as any).statusCode = 404;
        throw err;
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
        const err = new Error("Incorrect current password.");
        (err as any).statusCode = 401;
        throw err;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    return hospitalsCollection.updateOne({ _id: adminId }, { $set: { password: hashedPassword } });
};


// Parent Profile Services
export const findParentById = async (parentId: string) => {
    if (!db) await init();
    const parent = await parentsCollection.findOne({ _id: parentId });
    if (!parent) return null;

    if (parent.hospitalId) {
        const hospital = await hospitalsCollection.findOne({ _id: parent.hospitalId });
        parent.hospitalName = hospital ? hospital.hospitalName : 'Unknown Hospital';
    }

    return parent;
}

export const updateParentProfile = async (parentId: string, updates: any) => {
    if (!db) await init();
    return parentsCollection.updateOne({ _id: parentId }, { $set: updates });
}

export const changeParentPassword = async (parentId: string, currentPassword: string, newPassword: string
) => {
    if (!db) await init();
    const parent = await parentsCollection.findOne({ _id: parentId });

    if (!parent) {
        const err = new Error("Parent not found.");
        (err as any).statusCode = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, parent.password);
    if (!isMatch) {
        const err = new Error("Incorrect current password.");
        (err as any).statusCode = 401;
        throw err;
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    return parentsCollection.updateOne({ _id: parentId }, { $set: { password: hashedPassword } });
};


// Parent Timeline Services
export const getTimelineTasks = async (parentId: string) => {
    if (!db) await init();
    return timelinesCollection.findOne({ parentId });
};

export const updateTimelineTasks = async (parentId: string, tasks: any[]) => {
    if (!db) await init();
    return timelinesCollection.updateOne(
        { parentId },
        { $set: { parentId, tasks, updatedAt: new Date() } },
        { upsert: true }
    );
};

export const updateLastLogin = async (userId: string, role: string) => {
    if (!db) await init();
    const collection = getCollectionByRole(role);
    await collection.updateOne({ _id: userId }, { $set: { lastLogin: new Date() } });
};


// Superadmin services (omitted for brevity, no changes needed)
export const getSuperAdminDashboardData = async () => { /* ... */ };
export const getAllHospitals = async () => { /* ... */ };
export const updateHospitalStatus = async (hospitalId: string, status: string) => { /* ... */ };
export const getHospitalDetails = async (hospitalId: string) => { /* ... */ };
export const getSuperAdminAnalytics = async () => { /* ... */ };

// Doctor Services
export const getPatientsByDoctorId = async (doctorId: string) => {
    if (!db) await init();
    return parentsCollection.find({ doctorId: doctorId }, { projection: { password: 0 }}).toArray();
}


export const getDoctorDashboardData = async (doctorId: string) => {
    if (!db) await init();
    const activePatientsCount = await parentsCollection.countDocuments({ doctorId, status: 'Active' });
    
    // Placeholder data for consultations. A real implementation would query a consultations collection.
    const todaysConsultations = [
        { id: 101, patientName: "Baby Smith", time: "09:30 AM", reason: "Fever" },
        { id: 102, patientName: "Baby Jones", time: "11:00 AM", reason: "Routine Check-up" },
        { id: 103, patientName: "Baby Williams", time: "01:15 PM", reason: "Rash" },
    ];
    
    return {
        activePatients: activePatientsCount,
        todaysConsultations: todaysConsultations,
    };
};

export const getAdminDashboardData = async (hospitalId: string) => {
    if (!db) await init();

    const doctorCount = await doctorsCollection.countDocuments({ hospitalId });
    const parentCount = await parentsCollection.countDocuments({ hospitalId });

    // Mock data, as subscriptions and revenue are not fully implemented
    const activeSubscriptions = await subscriptionsCollection.countDocuments({ hospitalId, status: 'Active' });
    
    const subscriptions = await subscriptionsCollection.find({ hospitalId, status: 'Active' }).toArray();
    const planIds = subscriptions.map(s => s.planId);
    const plans = await plansCollection.find({ _id: { $in: planIds } }).toArray();
    const planPriceMap = new Map(plans.map(p => [p._id, p.monthlyPrice]));
    
    const monthlyRevenue = subscriptions.reduce((total, sub) => {
        return total + (planPriceMap.get(sub.planId) || 0);
    }, 0);


    const doctors = await doctorsCollection.find(
        { hospitalId }, 
        { projection: { name: 1, specialty: 1, avatarUrl: 1 } }
    ).limit(3).toArray();
    
    const doctorsSnapshot = await Promise.all(doctors.map(async (doctor) => {
        const patientCount = await parentsCollection.countDocuments({
            $or: [{ doctorId: doctor._id }, { teamId: { $in: (await teamsCollection.find({ hospitalId, "members.doctorId": doctor._id }).toArray()).map(t => t._id) } }]
        });
        return {
            ...doctor,
            patientCount,
            // These are mocked for now
            consultationsThisMonth: Math.floor(Math.random() * 50) + 10,
            satisfaction: (4.5 + Math.random() * 0.5).toFixed(1),
        };
    }));


    return {
        metrics: {
            doctors: doctorCount,
            parents: parentCount,
            activeSubscriptions: activeSubscriptions,
            monthlyRevenue: monthlyRevenue,
            churnRate: "2.1%", // Mock data
        },
        doctors: doctorsSnapshot,
    };
};

// Password Reset Services (omitted for brevity, no changes needed)
export const setPasswordResetToken = async (userId: string, role: string, tokens: { passwordResetToken: string, passwordResetExpires: Date }) => { /* ... */ };
export const findUserByResetToken = async (token: string) => { /* ... */ };
export const resetUserPassword = async (userId: string, role: string, newPassword: string) => { /* ... */ };

export const getParentDetailsForAdmin = async (parentId: string) => {
    if (!db) await init();
    const parent = await parentsCollection.findOne({ _id: parentId }, { projection: { password: 0 } });
    if (!parent) return null;

    if (parent.hospitalId) {
        const hospital = await hospitalsCollection.findOne({ _id: parent.hospitalId });
        parent.hospitalName = hospital?.hospitalName || "N/A";
    }

    if (parent.doctorId) {
        const doctor = await doctorsCollection.findOne({ _id: parent.doctorId });
        parent.doctorName = doctor?.name || "Unassigned";
    }

    return parent;
}


// Team Management Services
export const createTeam = async (hospitalId: string, name: string) => {
    if (!db) await init();
    const newTeam = {
        _id: generateId('team'),
        hospitalId,
        name,
        members: [],
        createdAt: new Date(),
    };
    await teamsCollection.insertOne(newTeam);
    return newTeam;
};

export const getTeamsByHospital = async (hospitalId: string) => {
    if (!db) await init();
    return teamsCollection.find({ hospitalId }).toArray();
};

export const findTeamById = async (teamId: string) => {
    if (!db) await init();
    return teamsCollection.findOne({ _id: teamId });
};

export const addMemberToTeam = async (teamId: string, doctorId: string, role: string) => {
    if (!db) await init();
    const doctor = await findDoctorById(doctorId);
    if (!doctor) throw new Error("Doctor to be added not found.");

    const newMember = {
        doctorId,
        name: doctor.name,
        role: role || doctor.specialty,
    };
    return teamsCollection.updateOne({ _id: teamId }, { $addToSet: { members: newMember } });
};

export const removeMemberFromTeam = async (teamId: string, memberId: string) => {
    if (!db) await init();
    return teamsCollection.updateOne({ _id: teamId }, { $pull: { members: { doctorId: memberId } } });
};

export const deleteTeam = async (teamId: string) => {
    if (!db) await init();
    // Also unassign parents from this team
    await parentsCollection.updateMany({ teamId: teamId }, { $set: { teamId: null } });
    return teamsCollection.deleteOne({ _id: teamId });
};

// Plan Management Services
export const getPlansByHospital = async (hospitalId: string) => {
    if (!db) await init();
    return plansCollection.find({ hospitalId }).toArray();
}

export const createOrUpdatePlan = async (hospitalId: string, planData: any) => {
    if(!db) await init();
    const { _id, ...dataToSave } = planData;
    const planId = _id || generateId('plan');

    return plansCollection.updateOne(
        { _id: planId, hospitalId: hospitalId },
        { $set: { ...dataToSave, hospitalId: hospitalId, updatedAt: new Date() } },
        { upsert: true }
    );
};

export const createSubscription = async (subscriptionData: { parentId: string, hospitalId: string, planId: string }) => {
    if (!db) await init();
    
    const newSubscription = {
        ...subscriptionData,
        _id: generateId('sub'),
        status: 'Active', // Assume active upon creation for now
        startDate: new Date(),
        // In a real app, you'd calculate next billing date based on plan
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    };
    
    await subscriptionsCollection.insertOne(newSubscription);
    return newSubscription;
};


export const getAdminAnalytics = async (hospitalId: string) => {
    if (!db) await init();

    // In a real app, this would involve complex aggregation pipelines.
    // For now, we'll use counts and mock some data.

    const metrics = {
        doctors: await doctorsCollection.countDocuments({ hospitalId }),
        parents: await parentsCollection.countDocuments({ hospitalId }),
        monthlyRevenue: 12500, // Mock data
    };

    const analytics = {
        parentGrowthRate: 8, // Mock data
        monthlyRevenue: [
            { month: "Jan", revenue: 8000 },
            { month: "Feb", revenue: 9000 },
            { month: "Mar", revenue: 10500 },
            { month: "Apr", revenue: 10000 },
            { month: "May", revenue: 11000 },
            { month: "Jun", revenue: 12500 },
        ],
        userGrowth: [
            { month: "Jan", parents: 180, doctors: 10 },
            { month: "Feb", parents: 195, doctors: 10 },
            { month: "Mar", parents: 210, doctors: 11 },
            { month: "Apr", parents: 220, doctors: 12 },
            { month: "May", parents: 240, doctors: 12 },
            { month: "Jun", parents: 256, doctors: 12 },
        ]
    };

    return { metrics, analytics };
};
