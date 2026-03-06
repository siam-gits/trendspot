"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"details" | "otp">("details");
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/register/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to send OTP");
            } else {
                toast.success("OTP sent to your email!");
                setStep("otp");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed");
            } else {
                toast.success("Account created! Please sign in.");
                router.push("/sign-in");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
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
                    <h1 className="text-2xl font-bold">
                        {step === "details" ? "Create an account" : "Verify your email"}
                    </h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        {step === "details"
                            ? <>Join <span className="brand-typography font-semibold text-foreground tracking-wider">trendspot</span> to save favorites and checkout</>
                            : `We've sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                    {step === "details" ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label htmlFor="register-name" className="text-sm font-medium block mb-1.5">
                                    Full Name
                                </label>
                                <Input
                                    id="register-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoComplete="name"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div>
                                <label htmlFor="register-email" className="text-sm font-medium block mb-1.5">
                                    Email
                                </label>
                                <Input
                                    id="register-email"
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
                                <label htmlFor="register-password" className="text-sm font-medium block mb-1.5">
                                    Password
                                </label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-xl h-11 mt-2"
                                disabled={loading}
                                id="register-send-otp-btn"
                            >
                                {loading ? "Sending code..." : "Send Verification Code"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="register-otp" className="text-sm font-medium block mb-1.5">
                                    One-Time Password
                                </label>
                                <Input
                                    id="register-otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="rounded-xl h-11 text-center tracking-[1em] font-bold"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-xl h-11"
                                disabled={loading}
                                id="register-submit-btn"
                            >
                                {loading ? "Verifying..." : "Verify & Create Account"}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep("details")}
                                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Back to details
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-5">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="text-foreground font-medium hover:underline underline-offset-2"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
