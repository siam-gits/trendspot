"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <Logo />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Discover the latest trends in fashion and technology. Curated excellence for the modern lifestyle.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-all">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-all">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-foreground hover:text-background transition-all">
                                <Youtube className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">Shop</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=smartphones" className="hover:text-foreground transition-colors">Smartphones</Link></li>
                            <li><Link href="/products?category=laptops" className="hover:text-foreground transition-colors">Laptops</Link></li>
                            <li><Link href="/products?category=fragrances" className="hover:text-foreground transition-colors">Fragrances</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-6 text-sm uppercase tracking-wider">Newsletter</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="relative group">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="pr-12 rounded-xl h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-foreground/20"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1 top-1 h-10 w-10 rounded-lg transition-transform active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} trendspot Store. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-foreground">Terms</Link>
                        <Link href="#" className="hover:text-foreground">Privacy</Link>
                        <Link href="#" className="hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
