import clientPromise from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { Db } from "mongodb";

const getDb = async (): Promise<Db> => {
    if (!process.env.MONGODB_URI) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
    const client = await clientPromise;
    return client.db();
};


const getUsersCollection = async () => {
    const db = await getDb();
    return db.collection("users");
};

export const findUserByEmail = async (email: string) => {
    const usersCollection = await getUsersCollection();
    return await usersCollection.findOne({ email });
};

export const createUser = async ({ name, email, password, role }: any) => {
  const usersCollection = await getUsersCollection();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userDocument = {
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(userDocument);
  
  return {
    ...userDocument,
    _id: result.insertedId,
  };
};

export const seedUsers = async () => {
    const usersCollection = await getUsersCollection();
    // In a mock environment, countDocuments might not exist or work as expected
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        const userCount = await usersCollection.countDocuments();
        if (userCount > 0) {
            return;
        }
    }


    console.log('Checking for existing users or seeding database...');

    const usersToSeed = [
        { email: 'parent@babyaura.in', role: 'Parent', name: "Parent's Name" },
        { email: 'doctor@babyaura.in', role: 'Doctor', name: "Dr. Emily Carter" },
        { email: 'admin@babyaura.in', role: 'Admin', name: 'Admin User' },
        { email: 'superadmin@babyaura.in', role: 'Superadmin', name: 'Super Admin' },
    ];

    const saltRounds = 10;
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    for (const user of usersToSeed) {
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (!existingUser) {
            const userDocument = {
                ...user,
                password: hashedPassword,
                createdAt: new Date(),
            };
            await usersCollection.insertOne(userDocument);
            console.log(`Seeded user: ${user.email}`);
        }
    }

    console.log('Database seeding check complete.');
};
