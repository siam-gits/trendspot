import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, otp } = await req.json();

        if (!name || !email || !password || !otp) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1. Verify OTP
        const verification = await VerificationToken.findOne({
            email: email.toLowerCase(),
            otp,
        });

        if (!verification) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create User
        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            favorites: [],
        });

        // 4. Delete the used verification token
        await VerificationToken.deleteOne({ _id: verification._id });

        return NextResponse.json(
            { message: "Account created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
