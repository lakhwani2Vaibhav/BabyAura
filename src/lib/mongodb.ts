// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Please add your Mongo URI to .env.local");
  } else {
    // In development, we can fall back to a mock or skip.
    console.warn("MONGODB_URI not found, using a placeholder promise for development build.");
    // This is a placeholder for development and will be replaced by the logic below if URI is present.
    clientPromise = new Promise(() => {}); 
  }
} 

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    if (uri) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    } else {
      // Fallback for dev mode without URI
       globalWithMongo._mongoClientPromise = new Promise(() => {});
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

const getDb = async (): Promise<Db> => {
    const mongoClient = await clientPromise;
    return mongoClient.db();
};

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
export { getDb }
