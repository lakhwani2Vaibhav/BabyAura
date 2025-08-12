import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db } from "mongodb";

let client;
let db: Db;
let usersCollection: any;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    usersCollection = db.collection('users');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();


export const findUserByEmail = async (email: string) => {
    if (!usersCollection) await init();
    return await usersCollection.findOne({ email });
};

export const createUser = async (userData: any) => {
  if (!usersCollection) await init();
  const { password, ...restOfUser } = userData;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDocument = {
    ...restOfUser,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(userDocument);
  
  return {
    ...userDocument,
    _id: result.insertedId,
  };
};

export const seedUsers = async () => {
    if (!usersCollection) await init();

    console.log('Checking for existing users or seeding database...');

    const usersToSeed = [
        { email: 'parent@babyaura.in', role: 'Parent', name: "Parent's Name", password: 'password' },
        { email: 'doctor@babyaura.in', role: 'Doctor', name: "Dr. Emily Carter", password: 'password' },
        { email: 'admin@babyaura.in', role: 'Admin', name: 'Admin User', password: 'password' },
        // Hardcoded Superadmins
        { email: 'babyauraindia@gmail.com', role: 'Superadmin', name: 'BabyAura Superadmin', password: 'BabyAura@123' },
        { email: 'shubham12342019@gmail.com', role: 'Superadmin', name: 'Shubham Superadmin', password: '$Shubh@912513' },
    ];

    const saltRounds = 10;

    for (const user of usersToSeed) {
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            const userDocument = {
                name: user.name,
                email: user.email,
                role: user.role,
                password: hashedPassword,
                createdAt: new Date(),
            };
            await usersCollection.insertOne(userDocument);
            console.log(`Seeded user: ${user.email}`);
        }
    }

    console.log('Database seeding check complete.');
};
