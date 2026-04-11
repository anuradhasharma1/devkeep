import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/core/db";
import User from "@/models/user";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        await connectDB();

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
        });

        return NextResponse.json({
            success: true,
            user: { id: user._id.toString(), name: user.name, email: user.email },
        }, { status: 201 });

    } catch (error) {
        console.error("[REGISTER ERROR]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}