import { readdir, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const files = await readdir(uploadDir);

    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file))
      .map((file) => `/uploads/${file}`);

    return NextResponse.json({ success: true, images }, { status: 200 });
  } catch {
    return NextResponse.json({ success: true, images: [] }, { status: 200 });
  }
}ش
