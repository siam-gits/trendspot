"use client";

import { Product } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { toggleFavorite } from "@/actions/favorites";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    isFavorited?: boolean;
    onFavoriteToggle?: (id: string, newFavorites: string[]) => void;
}

export function ProductCard({
    product,
    isFavorited = false,
    onFavoriteToggle,
}: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { data: session } = useSession();
    const router = useRouter();
    const [favorited, setFavorited] = useState(isFavorited);
    const [isToggling, setIsToggling] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        toast.success(`${product.title} added to cart`);
    };

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session) {
            router.push("/sign-in");
            return;
        }
        setIsToggling(true);
        try {
            const result = await toggleFavorite(String(product.id));
            const newFavorited = result.favorites.includes(String(product.id));
            setFavorited(newFavorited);
            if (onFavoriteToggle) {
                onFavoriteToggle(String(product.id), result.favorites);
            }
            toast.success(newFavorited ? "Added to favorites" : "Removed from favorites");
        } catch {
            toast.error("Failed to update favorites");
        } finally {
            setIsToggling(false);
        }
    };

    const discountedPrice =
        product.price * (1 - product.discountPercentage / 100);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <Link href={`/products/${product.id}`} className="block group">
                <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Image */}
                    <div className="relative aspect-square bg-muted overflow-hidden">
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Discount badge */}
                        {product.discountPercentage > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute top-3 left-3 text-xs font-semibold"
                            >
                                -{Math.round(product.discountPercentage)}%
                            </Badge>
                        )}
                        {/* Favorite button */}
                        <button
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${favorited
                                    ? "bg-red-500 text-white"
                                    : "bg-background/70 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-foreground"
                                }`}
                            onClick={handleFavorite}
                            disabled={isToggling}
                            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart
                                className={`w-4 h-4 transition-all ${favorited ? "fill-current" : ""}`}
                            />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        {product.brand && (
                            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">
                                {product.brand}
                            </p>
                        )}
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-foreground/80 transition-colors">
                            {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= Math.round(product.rating)
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-muted-foreground/30"
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                                ({product.rating.toFixed(1)})
                            </span>
                        </div>

                        {/* Price & Add to cart */}
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <span className="font-bold text-base">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                                {product.discountPercentage > 0 && (
                                    <span className="text-xs text-muted-foreground line-through ml-2">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <Button
                                size="sm"
                                className="rounded-full h-8 w-8 p-0 flex-shrink-0"
                                onClick={handleAddToCart}
                                aria-label={`Add ${product.title} to cart`}
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
