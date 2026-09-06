import mongoose from "mongoose";

// استفاده از globalThis برای پایداری در تمام محیط‌های Node.js
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  // بررسی متغیر محیطی در زمان اجرای تابع (نه در لود اولیه ماژول)
  if (!MONGODB_URI) {
    throw new Error("اتصال پیدا نشد: متغیر MONGODB_URI تنظیم نشده است.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
