
import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db, Collection } from "mongodb";

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

const generateId = (type: 'parent' | 'doctor' | 'hospital' | 'superadmin') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}-${timestamp}-${random}`;
}

export const findUserByEmail = async (email: string) => {
    if (!db) await init();
    
    const collections = [parentsCollection, doctorsCollection, hospitalsCollection, superadminsCollection];
    for (const collection of collections) {
        const user = await collection.findOne({ email });
        if (user) {
            // Add role based on collection name for consistent auth flow
            const role = collection.collectionName.replace(/s$/, ''); // parents -> parent
            return { ...user, role: role.charAt(0).toUpperCase() + role.slice(1) };
        }
    }
    return null;
};

export const createUser = async (userData: any) => {
  if (!db) await init();
  const { password, role, ...restOfUser } = userData;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDocument: any = {
    ...restOfUser,
    password: hashedPassword,
    createdAt: new Date(),
  };

  let collection;
  let result;
  const customId = generateId(role.toLowerCase());
  userDocument._id = customId;

  switch(role) {
    case 'Parent':
        collection = parentsCollection;
        // Link parent to hospital
        const hospital = await hospitalsCollection.findOne({ hospitalCode: userData.hospitalCode });
        if(hospital) {
            await parentHospitalLinksCollection.insertOne({
                parentId: customId,
                hospitalId: hospital._id,
                createdAt: new Date()
            });
        }
        break;
    case 'Doctor':
        collection = doctorsCollection;
        break;
    case 'Admin':
        collection = hospitalsCollection; // Admin user is the hospital entity
        userDocument.hospitalCode = generateId('hospital'); // a unique code for parents to join
        break;
    case 'Superadmin':
        collection = superadminsCollection;
        break;
    default:
        throw new Error("Invalid user role for creation.");
  }

  result = await collection.insertOne(userDocument);
  
  return {
    ...userDocument,
    // No need to return result.insertedId since we set our own _id
  };
};

export const seedUsers = async () => {
    if (!db) await init();

    console.log('Checking for existing users or seeding database...');

    const saltRounds = 10;
    
    // Seed Superadmins
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
    if(!existingHospital) {
        const hospitalCode = generateId('hospital');
        hospitalId = generateId('hospital');
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await hospitalsCollection.insertOne({
            _id: hospitalId,
            email: hospitalAdminEmail,
            name: 'General Hospital',
            password: hashedPassword,
            role: 'Admin',
            hospitalCode: hospitalCode,
            createdAt: new Date(),
        })
        console.log(`Seeded hospital: ${hospitalAdminEmail}`);
    } else {
        hospitalId = existingHospital._id;
    }
    
    // Seed an initial doctor linked to the hospital
    const doctorEmail = 'doctor@babyaura.in';
    const existingDoctor = await doctorsCollection.findOne({email: doctorEmail});
    if(!existingDoctor) {
        const hashedPassword = await bcrypt.hash('password', saltRounds);
        await doctorsCollection.insertOne({
            _id: generateId('doctor'),
            email: doctorEmail,
            name: 'Dr. Emily Carter',
            password: hashedPassword,
            role: 'Doctor',
            specialty: 'Pediatrics',
            hospitalId: hospitalId,
            createdAt: new Date(),
        })
        console.log(`Seeded doctor: ${doctorEmail}`);
    }
    
    // Seed an initial parent, find hospital by code to link
    const parentEmail = 'parent@babyaura.in';
    const existingParent = await parentsCollection.findOne({email: parentEmail});
    if(!existingParent) {
        const hospitalForParent = await hospitalsCollection.findOne({name: 'General Hospital'});
        if(hospitalForParent) {
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
                createdAt: new Date()
            });
            console.log(`Seeded parent: ${parentEmail}`);

            // Create the link
            await parentHospitalLinksCollection.insertOne({
                parentId: parentId,
                hospitalId: hospitalForParent._id,
                createdAt: new Date()
            });
            console.log(`Linked parent ${parentEmail} to hospital ${hospitalForParent.name}`);
        }
    }
    
    console.log('Database seeding check complete.');
};
