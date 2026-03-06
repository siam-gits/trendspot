"use client";

import { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";

interface FavoritesClientProps {
    products: Product[];
    initialFavorites: string[];
}

export function FavoritesClient({ products, initialFavorites }: FavoritesClientProps) {
    const [favorites, setFavorites] = useState<string[]>(initialFavorites);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);

    const handleFavoriteToggle = (id: string, newFavorites: string[]) => {
        setFavorites(newFavorites);
        // Remove un-favorited product from the list
        if (!newFavorites.includes(id)) {
            setDisplayedProducts((prev) => prev.filter((p) => String(p.id) !== id));
        }
    };

    if (displayedProducts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">All favorites removed. Browse more products!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedProducts.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isFavorited={favorites.includes(String(product.id))}
                    onFavoriteToggle={handleFavoriteToggle}
                />
            ))}
        </div>
    );
}
