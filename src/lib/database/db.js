import mongoose from "mongoose";

const globalForMongoose = globalThis;

let cached = globalForMongoose.mongoose;

if (!cached) {
  cached = globalForMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  // این بررسی باید داخل تابع باشد، نه در سطح فایل
  if (!MONGODB_URI) {
    throw new Error(
      "اتصال پیدا نشد: متغیر محیطی MONGODB_URI تعریف نشده است"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // برای اینکه درخواست بعدی دوباره امکان اتصال داشته باشد
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
