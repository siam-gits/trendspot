"use server";

import Cart from "@/models/Cart";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Product } from "@/lib/api";

export async function getCart() {
    const session = await auth();
    if (!session?.user?.email) return null;

    await connectDB();
    const cart = await Cart.findOne({ userEmail: session.user.email });
    return cart ? JSON.parse(JSON.stringify(cart.items)) : [];
}

export async function syncCart(items: any[]) {
    const session = await auth();
    if (!session?.user?.email) return;

    await connectDB();
    await Cart.findOneAndUpdate(
        { userEmail: session.user.email },
        { items },
        { upsert: true, new: true }
    );
}

export async function clearServerCart() {
    const session = await auth();
    if (!session?.user?.email) return;

    await connectDB();
    await Cart.findOneAndDelete({ userEmail: session.user.email });
}
