"use server";

import Stripe from "stripe";
import Order from "@/models/Order";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
}

export async function createCheckoutSession(items: CartItem[]) {
    const sessionAuth = await auth();
    if (!sessionAuth?.user?.email) {
        throw new Error("You must be logged in to checkout");
    }

    if (!items || items.length === 0) {
        throw new Error("Cart is empty");
    }

    await connectDB();

    const host = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const baseUrl = host.trim().replace(/\/$/, "");

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/`;

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a pending order first
    const order = await Order.create({
        userEmail: sessionAuth.user.email,
        items: items.map(item => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.thumbnail
        })),
        totalAmount,
        status: "pending"
    });

    const lineItems = items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.title,
                images: [item.thumbnail],
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            source: "trendspot-demo",
            orderId: order._id.toString()
        },
    });

    // Update order with session ID
    order.stripeSessionId = session.id;
    await order.save();

    return { sessionId: session.id, url: session.url };
}
