"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { requestPasswordReset } from "@/actions/auth";
import { Logo } from "@/components/Logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await requestPasswordReset(email);
            if (res.success) {
                setSubmitted(true);
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
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
                    <h1 className="text-2xl font-bold">Forgot password?</h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        No worries, we&apos;ll send you reset instructions.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium block mb-1.5">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-xl h-11"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Reset password"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4 space-y-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-semibold text-lg">Check your email</h2>
                                <p className="text-sm text-muted-foreground">
                                    We sent a password reset link to <span className="text-foreground font-medium">{email}</span>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full rounded-xl"
                                onClick={() => setSubmitted(false)}
                            >
                                Send another link
                            </Button>
                        </div>
                    )}
                </div>

                <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                </Link>
            </motion.div>
        </div>
    );
}
