import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        STRIPE_SECRET_KEY_SET: !!process.env.STRIPE_SECRET_KEY,
    });
}
