"use client";

import { motion } from "framer-motion";
import { HeroAnimation } from "@/components/HeroAnimation";
import { Product } from "@/lib/api";

export function HomeHero({ products }: { products: Product[] }) {
    return (
        <div className="relative overflow-visible">
            {/* The HeroAnimation component now handles the sticky viewport and 200vh height */}
            <HeroAnimation products={products} />

            {/* Content that appears after or overlaps slightly can be added here if needed, 
                but for a pure Apple-style scrollflow, we let the animation drive the experience. */}
        </div>
    );
}
