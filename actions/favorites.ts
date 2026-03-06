"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function getUserFavorites(): Promise<string[]> {
    const session = await auth();
    if (!session?.user?.email) return [];

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return user?.favorites || [];
}

export async function toggleFavorite(productId: string): Promise<{ favorites: string[] }> {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("Not authenticated");
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    const isFavorited = user.favorites.includes(productId);

    if (isFavorited) {
        user.favorites = user.favorites.filter((id: string) => id !== productId);
    } else {
        user.favorites.push(productId);
    }

    await user.save();
    revalidatePath("/favorites");
    revalidatePath(`/products/${productId}`);

    return { favorites: user.favorites };
}
