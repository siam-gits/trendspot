"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Heart, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/custom-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "@/components/CartSheet";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ModeToggle";
import { Logo } from "@/components/Logo";

export function Header() {
    const { data: session } = useSession();
    const totalItems = useCartStore((state) => state.totalItems());
    const clearCart = useCartStore((state) => state.clearCart);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const handleSignOut = () => {
        clearCart();
        signOut();
    };

    const { useEffect } = require("react");
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <Logo />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                All Products
                            </Link>

                            {/* Categories Dropdown */}
                            <DropdownMenu
                                trigger={
                                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                                        Categories
                                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                                    </button>
                                }
                            >
                                <DropdownMenuItem href="/products?search=smartphones">Smartphones</DropdownMenuItem>
                                <DropdownMenuItem href="/products?search=laptops">Laptops</DropdownMenuItem>
                                <DropdownMenuItem href="/products?search=fragrances">Fragrances</DropdownMenuItem>
                                <DropdownMenuItem href="/products?search=skincare">Skincare</DropdownMenuItem>
                                <DropdownMenuItem href="/products?search=groceries">Groceries</DropdownMenuItem>
                                <DropdownMenuItem href="/products?search=home-decoration">Home Decor</DropdownMenuItem>
                            </DropdownMenu>
                            {session && (
                                <>
                                    <Link
                                        href="/orders"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            {/* Cart button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                onClick={() => setCartOpen(true)}
                                aria-label="Open cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {mounted && totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-foreground text-background rounded-full flex items-center justify-center font-semibold"
                                    >
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </motion.span>
                                )}
                            </Button>

                            {/* Auth */}
                            {session ? (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/favorites">
                                        <Button variant="ghost" size="icon" aria-label="Favorites">
                                            <Heart className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Avatar className="w-8 h-8 cursor-pointer">
                                        <AvatarImage src={session.user?.image || ""} />
                                        <AvatarFallback className="text-xs bg-muted">
                                            {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleSignOut}
                                        aria-label="Sign out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/sign-in">
                                        <Button variant="ghost" size="sm" className="text-sm">
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="text-sm rounded-full px-5">
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-border/40 bg-background"
                        >
                            <div className="px-4 py-4 flex flex-col gap-3">
                                <Link
                                    href="/"
                                    className="text-sm py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className="text-sm py-2 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    All Products
                                </Link>

                                {/* Mobile Categories */}
                                <div className="flex flex-col gap-1 pl-4 border-l-2 border-primary/20">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 mt-2">Categories</span>
                                    <Link href="/products?search=smartphones" className="text-sm py-1.5 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Smartphones</Link>
                                    <Link href="/products?search=laptops" className="text-sm py-1.5 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Laptops</Link>
                                    <Link href="/products?search=electronics" className="text-sm py-1.5 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Electronics</Link>
                                </div>
                                {session ? (
                                    <>
                                        <Link
                                            href="/orders"
                                            className="text-sm py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            className="text-sm py-2 text-left text-muted-foreground"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleSignOut();
                                            }}
                                        >
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Link
                                            href="/sign-in"
                                            className="w-full text-center py-2.5 rounded-lg border border-border text-sm font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="w-full text-center py-2.5 rounded-lg bg-foreground text-background text-sm font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                                    <span className="text-sm font-medium">Appearance</span>
                                    <ModeToggle />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
        </>
    );
}
