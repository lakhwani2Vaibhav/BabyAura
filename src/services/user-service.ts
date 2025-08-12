

import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db, Collection, ObjectId } from "mongodb";

let client;
let db: Db;
let parentsCollection: Collection;
let doctorsCollection: Collection;
let hospitalsCollection: Collection;
let superadminsCollection: Collection;
let parentHospitalLinksCollection: Collection;


async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    parentsCollection = db.collection('parents');
    doctorsCollection = db.collection('doctors');
    hospitalsCollection = db.collection('hospitals');
    superadminsCollection = db.collection('superadmins');
    parentHospitalLinksCollection = db.collection('parentHospitalLinks');

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
        { collection: parentsCollection, role: 'Parent' },
        { collection: doctorsCollection, role: 'Doctor' },
        { collection: hospitalsCollection, role: 'Admin' },
        { collection: superadminsCollection, role: 'Superadmin' }
    ];

    for (const { collection, role } of collections) {
        const user = await collection.findOne({ email });
        if (user) {
            return { ...user, role };
        }
    }
    return null;
};

export const createUser = async (userData: any) => {
  if (!db) await init();
  const { password, role, hospitalCode, hospitalId, hospitalName, registeredBy, ...restOfUser } = userData;
  
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
  userDocument.status = 'Active'; // Default status for new users

  switch(role) {
    case 'Parent':
        collection = parentsCollection;
        // For independent parents
        if (!hospitalCode && !hospitalId) {
           if(!userDocument.phone || !userDocument.address) {
                throw new Error("Phone and address are required for independent parents.");
           }
        }
        // For parents registered with a code or by an admin/doctor
        else {
             let foundHospital;
             if (hospitalId) {
                foundHospital = await hospitalsCollection.findOne({ _id: hospitalId });
             } else if (hospitalCode) {
                foundHospital = await hospitalsCollection.findOne({ hospitalCode });
             }

             if (foundHospital) {
                 userDocument.hospitalId = foundHospital._id;
                 userDocument.hospitalCode = foundHospital.hospitalCode;
                 await parentHospitalLinksCollection.insertOne({
                    parentId: customId,
                    hospitalId: foundHospital._id,
                    createdAt: new Date()
                });
             } else {
                 throw new Error("Invalid hospital code or ID provided.");
             }
        }
        break;
    case 'Doctor':
        collection = doctorsCollection;
        if (!hospitalId) {
            throw new Error("Hospital ID is required for doctor registration.");
        }
        userDocument.hospitalId = hospitalId;
        break;
    case 'Admin':
        collection = hospitalsCollection;
        userDocument.hospitalName = hospitalName;
        userDocument.hospitalCode = `HOSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        break;
    case 'Superadmin':
        collection = superadminsCollection;
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
    let hospitalCodeForParent;

    if(!existingHospital) {
        hospitalCodeForParent = `GAH789`; // Make it deterministic for demo purposes
        hospitalId = "HOSP-ID-FROM-ADMIN-SESSION"; // Placeholder
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await hospitalsCollection.insertOne({
            _id: hospitalId,
            email: hospitalAdminEmail,
            name: 'General Hospital',
            password: hashedPassword,
            role: 'Admin',
            hospitalCode: hospitalCodeForParent,
            createdAt: new Date(),
        })
        console.log(`Seeded hospital: ${hospitalAdminEmail}`);
    } else {
        hospitalId = existingHospital._id;
        hospitalCodeForParent = existingHospital.hospitalCode;
    }
    
    // Seed an initial doctor linked to the hospital
    const doctorEmail = 'doctor@babyaura.in';
    const existingDoctor = await doctorsCollection.findOne({email: doctorEmail});
    let doctorId = 'd1'; // Make it deterministic for demo
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
            createdAt: new Date(),
        })
        console.log(`Seeded doctor: ${doctorEmail}`);
    } else {
        doctorId = existingDoctor._id;
    }
    
    // Seed an initial parent, find hospital by code to link
    const parentEmail = 'parent@babyaura.in';
    const existingParent = await parentsCollection.findOne({email: parentEmail});
    if(!existingParent) {
        if(hospitalCodeForParent) {
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
                hospitalCode: hospitalCodeForParent,
                createdAt: new Date(),
                status: 'Active'
            });
            console.log(`Seeded parent: ${parentEmail}`);

            // Create the link
            await parentHospitalLinksCollection.insertOne({
                parentId: parentId,
                hospitalId: hospitalId,
                createdAt: new Date()
            });
            console.log(`Linked parent ${parentEmail} to hospital 'General Hospital'`);
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
    return doctorsCollection.findOne({ _id: doctorId });
}

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

export const getParentsByHospital = async (hospitalId: string) => {
    if(!db) await init();

    // Corrected logic: Query parents collection directly by hospitalId
    const parents = await parentsCollection.find({ hospitalId: hospitalId }).toArray();
    
    // For each parent, we need to find their assigned doctor.
    // This is a simplification. A real app might have a more direct link.
    // For now, we'll assign a placeholder or the first doctor of the hospital.
    const doctors = await doctorsCollection.find({ hospitalId }).toArray();
    const firstDoctorName = doctors.length > 0 ? doctors[0].name : "N/A";

    return parents.map(parent => ({
        ...parent,
        assignedDoctor: firstDoctorName, // Placeholder logic
    }));
}

export const deleteParent = async (parentId: string) => {
    if(!db) await init();
    // Also delete the link in parentHospitalLinks
    await parentHospitalLinksCollection.deleteOne({ parentId: parentId });
    return parentsCollection.deleteOne({ _id: parentId });
}
