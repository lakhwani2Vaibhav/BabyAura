
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db, Collection, ObjectId } from "mongodb";

let client;
let db: Db;
let parentsCollection: Collection;
let doctorsCollection: Collection;
let hospitalsCollection: Collection;
let superadminsCollection: Collection;
let timelinesCollection: Collection;


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
        break;
    case 'Doctor':
        collection = doctorsCollection;
        customId = generateId('doctor');
        userDocument.hospitalId = hospitalId;
        userDocument.status = 'Active'; 
        userDocument.profileStatus = 'incomplete_profile';
        break;
    case 'Admin':
        collection = hospitalsCollection;
        customId = generateId('hospital');
        userDocument.status = 'pending_verification';
        userDocument.hospitalCode = `HOSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
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

  await collection.insertOne(userDocument);
  
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
        if(hospitalId) {
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
    return doctorsCollection.find({ hospitalId: hospitalId }).toArray();
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
    
    // Create a map of doctors in the hospital for efficient lookup
    const doctors = await doctorsCollection.find({ hospitalId }).toArray();
    const doctorMap = new Map(doctors.map(doc => [doc._id, doc.name]));

    return parents.map(parent => ({
        ...parent,
        assignedDoctor: parent.doctorId ? doctorMap.get(parent.doctorId) || "Unassigned" : "Unassigned",
    }));
}


export const deleteParent = async (parentId: string) => {
    if(!db) await init();
    return parentsCollection.deleteOne({ _id: parentId });
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
    return hospitalsCollection.updateOne({ _id: adminId }, { $set: { password: hashedNewPassword } });
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

    return parentsCollection.updateOne({ _id: parentId }, { $set: { password: hashedNewPassword } });
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

// Superadmin services
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
