import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import Users from "@/models/users";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET and PATCH handlers for the authenticated user's profile (user-panel)
export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await Users.findById(session.user.id).select("name email phoneNumber AvatarImage role").lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error fetching profile" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow updating phoneNumber (for now). Validate basic pattern.
    const phoneNumber = body.phoneNumber ? String(body.phoneNumber).trim() : undefined;
    if (phoneNumber && !/^09\d{9}$/.test(phoneNumber)) {
      return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
    }

    const update = {};
    if (typeof phoneNumber !== "undefined") update.phoneNumber = phoneNumber;

    const updated = await Users.findByIdAndUpdate(session.user.id, { $set: update }, { new: true }).select("name email phoneNumber AvatarImage role");

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error updating profile" }, { status: 500 });
  }
}
