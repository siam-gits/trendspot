"use server";

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getUserOrders() {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    await connectDB();
    const orders = await Order.find({ userEmail: session.user.email })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(orders));
}

export async function syncOrderStatus(sessionId: string) {
    if (!sessionId) return null;

    try {
        await connectDB();

        // Find existing order
        const order = await Order.findOne({ stripeSessionId: sessionId });
        if (!order) {
            console.error("Order not found for session:", sessionId);
            return null;
        }

        // If already paid, just return
        if (order.status === "paid") {
            return JSON.parse(JSON.stringify(order));
        }

        // Verify with Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (checkoutSession.payment_status === "paid") {
            order.status = "paid";
            await order.save();
        }

        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.error("Sync order error:", error);
        return null;
    }
}
