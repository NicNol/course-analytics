// See https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts
import mongoose from "mongoose";
import { config } from "dotenv";

config();

declare global {
  var mongoose: any;
}

declare var process: {
  env: {
    MONGODB_URI: string;
  };
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, options).then((mongoose) => mongoose);
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

  await cached.conn.connection.close();
};
