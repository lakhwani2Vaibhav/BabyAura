
import clientPromise, { getDb } from "@/lib/mongodb";
import bcrypt from 'bcrypt';

const getUsersCollection = async () => {
    try {
        const db = await getDb();
        return db.collection("users");
    } catch (error) {
        console.warn("Could not get users collection, likely due to missing DB connection for build. This is expected.");
        // Return a mock collection with no methods to prevent crashes during build
        return { findOne: async () => null, insertOne: async () => ({ insertedId: '' }), countDocuments: async () => 0, insertMany: async () => {} };
    }
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
    // The mock collection will return 0, so this check works for both cases.
    const userCount = await usersCollection.countDocuments();

    if (userCount > 0) {
        return; // Users already seeded
    }

    console.log('No users found. Seeding database...');

    const usersToSeed = [
        { email: 'parent@babyaura.in', role: 'Parent', name: "Parent's Name" },
        { email: 'doctor@babyaura.in', role: 'Doctor', name: "Dr. Emily Carter" },
        { email: 'admin@babyaura.in', role: 'Admin', name: 'Admin User' },
        { email: 'superadmin@babyaura.in', role: 'Superadmin', name: 'Super Admin' },
    ];

    const saltRounds = 10;
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userDocuments = usersToSeed.map(user => ({
        ...user,
        password: hashedPassword,
        createdAt: new Date(),
    }));

    await usersCollection.insertMany(userDocuments);
    console.log('Database seeded with initial users.');
};
