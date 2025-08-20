
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
  const { password, role, hospitalId, doctorId, ...restOfUser } = userData;
  
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
        if (doctorId) userDocument.doctorId = doctorId;
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


export const seedUsers = async () => {
    if (!db) await init();

    console.log('Checking for existing users and seeding database if necessary...');

    const saltRounds = 10;
    
    // Seed Superadmins
    const superadminsToSeed = [
        { email: 'superadmin@babyaura.in', name: 'BabyAura Superadmin', password: 'password' },
        { email: 'babyauraindia@gmail.com', name: 'BabyAura Superadmin', password: 'BabyAura@123' },
        { email: 'shubham12342019@gmail.com', name: 'Shubham Superadmin', password: '$Shubh@912513' },
    ];

    for (const user of superadminsToSeed) {
        const existingUser = await superadminsCollection.findOne({ email: user.email });
        if (!existingUser) {
            const {password, ...rest} = user;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await superadminsCollection.insertOne({ 
                _id: generateId('superadmin'),
                ...rest,
                role: 'Superadmin',
                password: hashedPassword,
                createdAt: new Date()
            });
            console.log(`Seeded superadmin: ${user.email}`);
        }
    }
    
    // Seed an initial hospital/admin
    const hospitalAdminEmail = 'admin@babyaura.in';
    const existingHospital = await hospitalsCollection.findOne({email: hospitalAdminEmail});
    let hospitalId;

    if(!existingHospital) {
        hospitalId = generateId('hospital'); 
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await hospitalsCollection.insertOne({
            _id: hospitalId,
            email: hospitalAdminEmail,
            ownerName: 'Admin User',
            hospitalName: 'General Hospital',
            password: hashedPassword,
            role: 'Admin',
            status: 'verified', 
            hospitalCode: 'GAH789',
            createdAt: new Date(),
        })
        await initializeHospitalDocuments(hospitalId);
        console.log(`Seeded hospital: ${hospitalAdminEmail}`);
    } else {
        hospitalId = existingHospital._id;
    }
    
    // Seed an initial doctor linked to the hospital
    const doctorEmail = 'doctor@babyaura.in';
    const existingDoctor = await doctorsCollection.findOne({email: doctorEmail});
    let doctorId;
    if(!existingDoctor) {
        doctorId = generateId('doctor');
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await doctorsCollection.insertOne({
            _id: doctorId,
            email: doctorEmail,
            name: 'Dr. Emily Carter',
            password: hashedPassword,
            role: 'Doctor',
            specialty: 'Pediatrics',
            hospitalId: hospitalId,
            status: 'Active',
            profileStatus: 'complete',
            createdAt: new Date(),
        })
        console.log(`Seeded doctor: ${doctorEmail}`);
    } else {
        doctorId = existingDoctor._id;
    }
    
    // Seed an initial parent linked to the hospital
    const parentEmail = 'parent@babyaura.in';
    const existingParent = await parentsCollection.findOne({email: parentEmail});
    if(!existingParent) {
        if(hospitalId && doctorId) { // Ensure hospital and doctor exist before creating parent
            const parentId = generateId('parent');
            const hashedPassword = await bcrypt.hash('password', saltRounds);
            await parentsCollection.insertOne({
                _id: parentId,
                email: parentEmail,
                name: "Parent's Name",
                password: hashedPassword,
                role: 'Parent',
                babyName: 'Aura', 
                babyDob: '2023-12-05',
                hospitalId: hospitalId,
                doctorId: doctorId,
                createdAt: new Date(),
                status: 'Active'
            });
            console.log(`Seeded parent: ${parentEmail}`);
        }
    }
    
    console.log('Database seeding check complete.');
};


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
export const updateAdminProfile = async (adminId: string, updates: { name: string }) => {
    if (!db) await init();
    // Admins are stored in the 'hospitals' collection, so we update the 'ownerName'
    return hospitalsCollection.updateOne({ _id: adminId }, { $set: { ownerName: updates.name } });
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
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
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


// Superadmin services
export const getSuperAdminDashboardData = async () => {
    if (!db) await init();
    
    const activeHospitals = await hospitalsCollection.countDocuments({ status: 'verified' });
    const totalParents = await parentsCollection.countDocuments();
    const totalDoctors = await doctorsCollection.countDocuments();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const dauParents = await parentsCollection.countDocuments({ lastLogin: { $gte: twentyFourHoursAgo } });
    const dauDoctors = await doctorsCollection.countDocuments({ lastLogin: { $gte: twentyFourHoursAgo } });
    const dauAdmins = await hospitalsCollection.countDocuments({ lastLogin: { $gte: twentyFourHoursAgo } });

    // A basic MRR calculation. In a real app, this would be more complex.
    // For now, we'll assume a flat fee per hospital.
    const totalMRR = activeHospitals * 5000;

    const onboardingRequests = await hospitalsCollection.find({ status: 'pending_verification' })
        .project({ hospitalName: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .toArray();
    
    return {
        metrics: {
            activeHospitals,
            totalUsers: totalParents + totalDoctors,
            totalMRR,
            churnRate: "1.2%", // Placeholder
            userActivity: dauParents + dauAdmins,
        },
        onboardingRequests,
    }
}

export const getAllHospitals = async () => {
    if (!db) await init();
    return await hospitalsCollection.find({}).project({ password: 0 }).toArray();
}

export const updateHospitalStatus = async (hospitalId: string, status: string) => {
    if (!db) await init();
    const result = await hospitalsCollection.updateOne(
        { _id: hospitalId },
        { $set: { status: status } }
    );

    let title;
    let description;

    switch (status) {
        case 'verified':
            title = 'Your Hospital Account is Approved!';
            description = 'Your hospital is now active on the BabyAura platform.';
            break;
        case 'suspended':
            title = 'Your Hospital Account has been Suspended';
            description = 'Access to your admin dashboard has been temporarily restricted.';
            break;
        case 'rejected':
             title = 'Your Hospital Application Update';
             description = 'Unfortunately, your application to join BabyAura has been rejected at this time.';
             break;
        default:
            title = 'Your Hospital Account Status has been Updated';
            description = `Your account status is now: ${capitalize(status)}`;
    }


    // Notify the admin of the hospital about the status change
    await createNotification({
        userId: hospitalId,
        title: title,
        description: description,
        href: '/admin/dashboard'
    });

    return result;
}

export const getHospitalDetails = async (hospitalId: string) => {
    if (!db) await init();

    const hospital = await hospitalsCollection.findOne({ _id: hospitalId }, { projection: { password: 0 }});
    if (!hospital) {
        return null;
    }

    const doctors = await doctorsCollection.find({ hospitalId: hospital._id }, { projection: { password: 0 }}).toArray();
    const parents = await parentsCollection.find({ hospitalId: hospital._id }, { projection: { password: 0 }}).toArray();

    const doctorMap = new Map(doctors.map(doc => [doc._id.toString(), doc.name]));
    
    const parentsWithDoctorNames = parents.map(parent => ({
        ...parent,
        assignedDoctor: parent.doctorId ? doctorMap.get(parent.doctorId.toString()) || "Unassigned" : "Unassigned"
    }));

    return {
        ...hospital,
        doctors,
        parents: parentsWithDoctorNames
    };
}


export const getSuperAdminAnalytics = async () => {
    if (!db) await init();

    const totalHospitals = await hospitalsCollection.countDocuments({ status: 'verified' });
    const totalParents = await parentsCollection.countDocuments();
    const totalDoctors = await doctorsCollection.countDocuments();
    const totalUsers = totalParents + totalDoctors;

    // Placeholder for MRR calculation. In a real app, this would involve complex aggregation
    // based on each hospital's subscription plan and number of active parents/doctors.
    const platformMRR = totalHospitals * 5000; 

    // Placeholder data for charts as we don't store historical data yet.
    const monthlyRevenue = [
        { month: "Jan", revenue: 120000 },
        { month: "Feb", revenue: 130000 },
        { month: "Mar", revenue: 145000 },
        { month: "Apr", revenue: 155000 },
        { month: "May", revenue: 160000 },
        { month: "Jun", revenue: 170000 },
    ];
    const userGrowth = [
        { month: "Jan", parents: 8000, doctors: 800 },
        { month: "Feb", parents: 9000, doctors: 850 },
        { month: "Mar", parents: 10500, doctors: 900 },
        { month: "Apr", parents: 12000, doctors: 950 },
        { month: "May", parents: 13000, doctors: 1000 },
        { month: "Jun", parents: 14800, doctors: 1100 },
    ];

    return {
        totalHospitals,
        totalUsers,
        platformMRR,
        growthRate: 12, // Placeholder
        monthlyRevenue,
        userGrowth
    };
};

// Admin Dashboard Service
export const getAdminDashboardData = async (hospitalId: string) => {
    if (!db) await init();

    const doctorCount = await doctorsCollection.countDocuments({ hospitalId });
    const parentCount = await parentsCollection.countDocuments({ hospitalId });

    const doctors = await doctorsCollection.find({ hospitalId }).toArray();
    const doctorSnapshots = await Promise.all(doctors.map(async (doctor) => {
        const patientCount = await parentsCollection.countDocuments({ doctorId: doctor._id });
        return {
            _id: doctor._id,
            name: doctor.name,
            specialty: doctor.specialty,
            avatarUrl: doctor.avatarUrl,
            patientCount: patientCount,
            consultationsThisMonth: Math.floor(Math.random() * 50) + 10, // Placeholder
            satisfaction: (4.5 + Math.random() * 0.5).toFixed(1), // Placeholder
        };
    }));

    // Placeholder calculations for other metrics
    const monthlyRevenue = parentCount * 50; 
    const activeSubscriptions = Math.floor(parentCount * 0.95);
    const churnRate = 2.5;

    return {
        metrics: {
            doctors: doctorCount,
            parents: parentCount,
            activeSubscriptions,
            monthlyRevenue,
            churnRate: churnRate.toString(),
        },
        doctors: doctorSnapshots,
    };
};

// Admin Analytics Service
export const getAdminAnalytics = async (hospitalId: string) => {
    if (!db) await init();

    const doctorCount = await doctorsCollection.countDocuments({ hospitalId });
    const parentCount = await parentsCollection.countDocuments({ hospitalId });
    const monthlyRevenue = parentCount * 50; // Placeholder calculation

    // Placeholder data for charts
    const monthlyRevenueData = [
        { month: "Jan", revenue: 8000 },
        { month: "Feb", revenue: 9000 },
        { month: "Mar", revenue: 10500 },
        { month: "Apr", revenue: 10000 },
        { month: "May", revenue: 11000 },
        { month: "Jun", revenue: 12000 },
    ];
    const userGrowthData = [
        { month: "Jan", parents: 180, doctors: 10 },
        { month: "Feb", parents: 195, doctors: 10 },
        { month: "Mar", parents: 210, doctors: 11 },
        { month: "Apr", parents: 220, doctors: 12 },
        { month: "May", parents: 240, doctors: 12 },
        { month: "Jun", parents: parentCount, doctors: doctorCount },
    ];

    return {
        metrics: {
            doctors: doctorCount,
            parents: parentCount,
            monthlyRevenue,
        },
        analytics: {
            parentGrowthRate: 8, // Placeholder
            monthlyRevenue: monthlyRevenueData,
            userGrowth: userGrowthData,
        }
    };
};

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
        todaysConsultations: todaysConsultations, // Keeping this static for now
    };
};

// Password Reset Services
export const setPasswordResetToken = async (userId: string, role: string, tokens: { passwordResetToken: string, passwordResetExpires: Date }) => {
    if (!db) await init();
    const collection = getCollectionByRole(role);
    await collection.updateOne(
        { _id: userId },
        { $set: tokens }
    );
};

export const findUserByResetToken = async (token: string) => {
    if (!db) await init();
    const collections = [parentsCollection, doctorsCollection, hospitalsCollection, superadminsCollection];

    for (const collection of collections) {
        const user = await collection.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        });
        if (user) return user;
    }
    return null;
}

export const resetUserPassword = async (userId: string, role: string, newPassword: string) => {
    if (!db) await init();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const collection = getCollectionByRole(role);
    await collection.updateOne(
        { _id: userId },
        {
            $set: { password: hashedPassword },
            $unset: { passwordResetToken: "", passwordResetExpires: "" },
        }
    );
}

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
}

export const addMemberToTeam = async (teamId: string, doctorId: string, role: string) => {
    if (!db) await init();
    const doctor = await findDoctorById(doctorId);
    if (!doctor) {
        throw new Error("Doctor not found.");
    }
    
    const team = await findTeamById(teamId);
    if (team && team.members.some((m: any) => m.doctorId === doctorId)) {
        throw new Error("Doctor is already in this team.");
    }
    
    const newMember = {
        doctorId,
        name: doctor.name,
        role: role,
        addedAt: new Date(),
    };

    return teamsCollection.updateOne(
        { _id: teamId },
        { $push: { members: newMember } }
    );
};

export const removeMemberFromTeam = async (teamId: string, memberId: string) => {
    if (!db) await init();
    return teamsCollection.updateOne(
        { _id: teamId },
        { $pull: { members: { doctorId: memberId } } }
    );
};


export const deleteTeam = async (teamId: string) => {
    if (!db) await init();
    // Optional: Find parents assigned to this team and set their teamId to null
    await parentsCollection.updateMany({ teamId: teamId }, { $set: { teamId: null } });
    return teamsCollection.deleteOne({ _id: teamId });
}
