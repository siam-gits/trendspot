"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Chrome } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid email or password. Please try again.");
            } else {
                toast.success("Signed in successfully!");
                router.push("/");
                router.refresh();
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch {
            toast.error("Google sign-in failed.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-8">
                        <Logo className="scale-110" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        Sign in to your <span className="brand-typography font-semibold text-foreground tracking-wider">trendspot</span> account
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
                    {/* Google */}
                    <Button
                        variant="outline"
                        className="w-full rounded-xl gap-2 h-11"
                        onClick={handleGoogle}
                        disabled={googleLoading}
                        id="google-signin-btn"
                    >
                        <Chrome className="w-4 h-4" />
                        {googleLoading ? "Redirecting..." : "Continue with Google"}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-card text-muted-foreground">or</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label htmlFor="signin-email" className="text-sm font-medium block mb-1.5">
                                Email
                            </label>
                            <Input
                                id="signin-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="rounded-xl h-11"
                            />
                        </div>
                        <div>
                            <label htmlFor="signin-password" className="text-sm font-medium block mb-1.5">
                                Password
                            </label>
                            <Input
                                id="signin-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="rounded-xl h-11"
                            />
                            <div className="flex justify-end mt-1">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full rounded-xl h-11"
                            disabled={loading}
                            id="signin-submit-btn"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-5">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-foreground font-medium hover:underline underline-offset-2"
                    >
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
