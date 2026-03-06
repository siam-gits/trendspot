"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { resetPassword } from "@/actions/auth";
import { Logo } from "@/components/Logo";
import { use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const { token } = use(params);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            const res = await resetPassword(token, password);
            if (res.success) {
                setSuccess(true);
                toast.success(res.message);
                setTimeout(() => {
                    router.push("/sign-in");
                }, 3000);
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
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        Please enter your new password below.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="password" className="text-sm font-medium block mb-1.5">
                                        New Password
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="rounded-xl h-11"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="text-sm font-medium block mb-1.5">
                                        Confirm Password
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="rounded-xl h-11"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-xl h-11"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Reset password"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4 space-y-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-semibold text-lg">Password reset</h2>
                                <p className="text-sm text-muted-foreground">
                                    Your password has been successfully reset. Redirecting you to sign in...
                                </p>
                            </div>
                            <Button
                                className="w-full rounded-xl"
                                onClick={() => router.push("/sign-in")}
                            >
                                Sign in now
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
