"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/api";

export function HeroAnimation({ products }: { products: Product[] }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [heroProduct, setHeroProduct] = useState<Product | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Setup scroll-linked animation hooks targeting the viewport
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end end"]
    });

    // Smooth the scroll progress for a high-end feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001
    });

    // Apple-style transforms
    const scale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.8, 1.2, 1.2, 2]);
    const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -10]);
    const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-15, 0, 10]);
    const opacity = useTransform(smoothProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
    const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
    const textScale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);

    // Background glow opacity calculation
    const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

    // Image cross-fade progress
    const img1Opacity = useTransform(smoothProgress, [0, 0.5, 0.6, 1], [1, 1, 0, 0]);
    const img2Opacity = useTransform(smoothProgress, [0, 0.4, 0.5, 1], [0, 0, 1, 1]);
    const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

    useEffect(() => {
        if (products && products.length > 0) {
            const randomIndex = Math.floor(Math.random() * products.length);
            setHeroProduct(products[randomIndex]);
        }
        setMounted(true);
    }, [products]);

    const isDark = resolvedTheme === "dark";

    if (!mounted || !heroProduct) return null;

    return (
        <div ref={containerRef} className="relative w-full h-[200vh]">
            {/* Sticky Container for the animation */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Background Glow (Minimalist) */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity: glowOpacity }}
                >
                    <div className={`w-[800px] h-[800px] rounded-full blur-[140px] ${isDark ? "bg-primary/20" : "bg-primary/10"
                        }`} />
                </motion.div>

                {/* Hero Text (Fades on Scroll) */}
                <motion.div
                    className="absolute z-10 text-center px-4"
                    style={{ opacity: textOpacity, scale: textScale }}
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                        {heroProduct.brand}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto">
                        {heroProduct.title} &mdash; A new era of design.
                    </p>
                </motion.div>

                {/* Main Product Showcase */}
                <motion.div
                    className="relative z-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center"
                    style={{
                        scale,
                        rotateX,
                        rotateY,
                        opacity,
                        perspective: "1000px"
                    }}
                >
                    {/* Shadow Layer */}
                    <div className="absolute -bottom-20 w-1/2 h-10 bg-black/20 dark:bg-black/40 blur-3xl rounded-full" />

                    {/* Product Image Frame */}
                    <div className="relative group w-full h-full flex items-center justify-center">
                        {/* Dynamic Image Sequence (Cross-fade between 2 main images for "flow") */}
                        <motion.img
                            src={heroProduct.images[0] || heroProduct.thumbnail}
                            alt={heroProduct.title}
                            className="absolute w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                            style={{
                                opacity: img1Opacity
                            }}
                        />
                        {heroProduct.images[1] && (
                            <motion.img
                                src={heroProduct.images[1]}
                                alt={heroProduct.title}
                                className="absolute w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                                style={{
                                    opacity: img2Opacity
                                }}
                            />
                        )}

                        {/* Premium Glass Overlay */}
                        <div className="absolute inset-0 rounded-[4rem] border border-white/10 pointer-events-none glass-reflection opacity-20" />
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                    style={{ opacity: scrollIndicatorOpacity }}
                >
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Scroll to reveal</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
