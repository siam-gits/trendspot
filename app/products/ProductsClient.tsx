"use client";

import { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProductsClientProps {
    products: Product[];
    userFavorites: string[];
}

export function ProductsClient({ products, userFavorites }: ProductsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [favorites, setFavorites] = useState<string[]>(userFavorites);
    const [loading, setLoading] = useState(false);

    const filtered = products.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleFavoriteToggle = (_id: string, newFavorites: string[]) => {
        setFavorites(newFavorites);
    };

    const clearSearch = () => {
        setSearch("");
        router.replace("/products");
    };

    return (
        <div>
            {/* Search bar */}
            <div className="relative max-w-lg mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search products, brands, categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-9 rounded-full h-11"
                    id="product-search"
                />
                {search && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                {search && ` for "${search}"`}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isFavorited={favorites.includes(String(product.id))}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No products found.</p>
                    <button
                        onClick={clearSearch}
                        className="mt-3 text-sm underline underline-offset-2"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
}
