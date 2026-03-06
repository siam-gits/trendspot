"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "@/models/User";
import connectDB from "@/lib/db";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function requestPasswordReset(emailInput: string) {
    try {
        await connectDB();
        const email = emailInput.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            // We return success even if user not found for security reasons
            return { success: true, message: "If an account exists, a reset link will be sent." };
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetToken = hashedToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `"TrendSpot Store" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request - TrendSpot Store",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111;">Reset your password</h2>
                    <p>We received a request to reset your password for your TrendSpot account. Click the button below to proceed:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; rounded: 8px; margin: 20px 0;">Reset Password</a>
                    <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">TrendSpot Store - Portfolio Demo</p>
                </div>
            `,
        });

        return { success: true, message: "If an account exists, a reset link will be sent." };
    } catch (error) {
        console.error("Password reset request error:", error);
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        await connectDB();
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return { success: false, message: "Invalid or expired token." };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return { success: true, message: "Password reset successful! You can now sign in." };
    } catch (error) {
        console.error("Password reset error:", error);
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}
