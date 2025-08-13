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
        { collection: hospitalsCollection, role: 'Admin', nameField: 'ownerName' }, // Use ownerName for hospital admin
        { collection: superadminsCollection, role: 'Superadmin', nameField: 'name' }
    ];

    for (const { collection, role, nameField } of collections) {
        const user = await collection.findOne({ email });
        if (user) {
            const finalUser = { ...user, role, name: user[nameField] };
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
  const customId = generateId(role.toLowerCase());
  userDocument._id = customId;
  userDocument.role = role;
  

  switch(role) {
    case 'Parent':
        collection = parentsCollection;
        userDocument.status = 'Active';
        if (hospitalId) {
            userDocument.hospitalId = hospitalId;
        }
        if (doctorId) {
            userDocument.doctorId = doctorId;
        }
        break;
    case 'Doctor':
        collection = doctorsCollection;
        userDocument.hospitalId = hospitalId; // Can be null if self-registered
        userDocument.status = 'active'; // e.g. active, suspended
        userDocument.profileStatus = 'incomplete_profile'; // e.g. incomplete_profile, under_review, complete
        break;
    case 'Admin':
        collection = hospitalsCollection;
        userDocument._id = generateId('hospital'); // Use specific ID for clarity
        userDocument.status = 'pending_verification'; // Initial status
        userDocument.hospitalCode = `HOSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        // ownerName, hospitalName, address, mobile are already in restOfUser
        break;
    case 'Superadmin':
        collection = superadminsCollection;
        userDocument.status = 'Active';
        break;
    default:
        throw new Error("Invalid user role for creation.");
  }

  await collection.insertOne(userDocument);
  
  const { password: _, ...userWithoutPassword } = userDocument;
  return userWithoutPassword;
};


export const seedUsers = async () => {
    if (!db) await init();

    console.log('Checking for existing users and seeding database if necessary...');

    const saltRounds = 10;
    
    // Seed Superadmins - This is the definitive implementation
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
        hospitalId = "HOSP-ID-FROM-ADMIN-SESSION"; // Placeholder
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await hospitalsCollection.insertOne({
            _id: hospitalId,
            email: hospitalAdminEmail,
            ownerName: 'Admin User',
            hospitalName: 'General Hospital',
            password: hashedPassword,
            role: 'Admin',
            status: 'verified', // Pre-verify for demo purposes
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
    let doctorId = 'd1';
    if(!existingDoctor) {
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

    const doctors = await doctorsCollection.find({ hospitalId: hospitalId }, { projection: { password: 0 }}).toArray();
    const parents = await parentsCollection.find({ hospitalId: hospitalId }, { projection: { password: 0 }}).toArray();

    const doctorMap = new Map(doctors.map(doc => [doc._id, doc.name]));
    
    const parentsWithDoctorNames = parents.map(parent => ({
        ...parent,
        assignedDoctor: parent.doctorId ? doctorMap.get(parent.doctorId) || "Unassigned" : "Unassigned"
    }));

    return {
        ...hospital,
        doctors,
        parents: parentsWithDoctorNames
    };
}
