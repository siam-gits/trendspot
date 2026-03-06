"use client";

import { Product } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { toggleFavorite } from "@/actions/favorites";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductDetailClientProps {
    product: Product;
    isFavorited: boolean;
}

export function ProductDetailClient({
    product,
    isFavorited: initialFavorited,
}: ProductDetailClientProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { data: session } = useSession();
    const router = useRouter();
    const [favorited, setFavorited] = useState(initialFavorited);
    const [selectedImage, setSelectedImage] = useState(product.images[0] || product.thumbnail);
    const [added, setAdded] = useState(false);

    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        toast.success(`${product.title} added to cart`);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleFavorite = async () => {
        if (!session) {
            router.push("/sign-in");
            return;
        }
        try {
            const result = await toggleFavorite(String(product.id));
            const newFavorited = result.favorites.includes(String(product.id));
            setFavorited(newFavorited);
            toast.success(newFavorited ? "Added to favorites" : "Removed from favorites");
        } catch {
            toast.error("Failed to update favorites");
        }
    };

    return (
        <div>
            <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                {/* Images */}
                <div className="space-y-4">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
                    >
                        <Image
                            src={selectedImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </motion.div>
                    {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {product.images.slice(0, 6).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === img
                                            ? "border-foreground"
                                            : "border-transparent"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.title} ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-5">
                    {product.brand && (
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {product.brand}
                        </p>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold leading-snug">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(product.rating)
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-muted-foreground/30"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {product.rating.toFixed(1)} / 5.0
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">
                            ${discountedPrice.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                                <Badge variant="destructive">
                                    -{Math.round(product.discountPercentage)}% OFF
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    {/* Stock */}
                    <p className="text-sm">
                        <span
                            className={`font-medium ${product.stock > 10 ? "text-green-600" : "text-amber-600"
                                }`}
                        >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            size="lg"
                            className="flex-1 rounded-full gap-2"
                            onClick={handleAddToCart}
                        >
                            {added ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Added!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className={`rounded-full px-4 ${favorited ? "text-red-500 border-red-200" : ""}`}
                            onClick={handleFavorite}
                            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart
                                className={`w-5 h-5 ${favorited ? "fill-current text-red-500" : ""}`}
                            />
                        </Button>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs capitalize">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
