import mongoose from 'mongoose';

// Ensure the MongoDB URI is defined in your environment variables (.env.local)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Global variable to hold the cached connection promise
// This pattern is crucial for Next.js to reuse the connection across hot reloads and serverless function calls.
type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

declare global {
  // allow attaching a cache to the global object in Node.js
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache;

if (global.mongooseCache) {
  cached = global.mongooseCache;
} else {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to MongoDB, reusing a cached connection if available.
 * @returns A promise that resolves to the Mongoose connection object.
 */
async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    
    // Mongoose connection options (optional, but good practice)
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering
    };

    // Start the connection attempt and cache the promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established successfully.');
      return mongooseInstance;
    });
  }

  // Wait for the cached promise to resolve and store the resolved connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;