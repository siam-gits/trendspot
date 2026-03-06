import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import { auth } from "@/auth";
import { getUserFavorites } from "@/actions/favorites";
import { ProductsClient } from "./ProductsClient";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";

export const metadata: Metadata = {
    title: "All Products",
    description: "Browse all trending demo products. Filter by name, brand, or category.",
};

function ProductsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export default async function ProductsPage() {
    const [products, session] = await Promise.all([fetchProducts(100), auth()]);
    const userFavorites = session ? await getUserFavorites() : [];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">All Products</h1>
                <p className="text-muted-foreground">
                    {products.length} curated demo products from dummyjson.com
                </p>
            </div>

            <Suspense fallback={<ProductsGridSkeleton />}>
                <ProductsClient products={products} userFavorites={userFavorites} />
            </Suspense>
        </div>
    );
}
