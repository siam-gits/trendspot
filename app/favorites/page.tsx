import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserFavorites } from "@/actions/favorites";
import { fetchProductsByIds } from "@/lib/api";
import { FavoritesClient } from "./FavoritesClient";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Your Favorites",
    description: "View and manage your saved favorite products.",
};

export default async function FavoritesPage() {
    const session = await auth();
    if (!session) {
        redirect("/sign-in");
    }

    const favoriteIds = await getUserFavorites();
    const products = await fetchProductsByIds(favoriteIds);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Your Favorites</h1>
                    <p className="text-sm text-muted-foreground">
                        {products.length} saved product{products.length !== 1 ? "s" : ""} • {session.user?.name}
                    </p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">No favorites yet</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Start browsing products and tap the heart icon to save your favorites.
                    </p>
                    <Link href="/products">
                        <Button className="rounded-full">Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <FavoritesClient products={products} initialFavorites={favoriteIds} />
            )}
        </div>
    );
}
