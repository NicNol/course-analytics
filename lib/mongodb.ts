// See https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts
import mongoose from "mongoose";
import { requireEnv } from "./env";

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

declare global {
  // This must be a `var` and not a `let / const` — global augmentation requires var.
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export const connectToDatabase = async () => {
  const MONGODB_URI = requireEnv("MONGODB_URI");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};

export const disconnectFromDatabase = async () => {
  if (!cached.promise) return;

  await cached.promise;

  await cached.conn?.connection.close();
};
