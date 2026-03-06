"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home, Loader2, Package } from "lucide-react";
import { syncOrderStatus } from "@/actions/orders";
import { toast } from "sonner";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        async function verify() {
            try {
                const updatedOrder = await syncOrderStatus(sessionId as string);
                if (updatedOrder) {
                    setOrder(updatedOrder);
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
            }
        }

        verify();
    }, [sessionId]);

    if (status === "loading") {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Verifying your payment...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Order Verification Failed</h1>
                <p className="text-muted-foreground mb-8">
                    We couldn&apos;t verify your payment session. Please check your orders page.
                </p>
                <Link href="/orders">
                    <Button className="rounded-full">Go to My Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="text-center max-w-2xl w-full">
                {/* Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-full h-full rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed text-lg">
                    Thank you for your purchase. Your order has been placed and is being processed.
                </p>

                {/* Order Summary Card */}
                {order && (
                    <div className="bg-card border rounded-2xl p-6 mb-10 text-left shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Order ID</p>
                                <p className="font-mono text-sm">{order._id.substring(0, 12).toUpperCase()}...</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 border">
                                        <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t flex justify-between items-center">
                            <p className="font-bold text-lg">Total Amount</p>
                            <p className="font-bold text-2xl text-primary">${order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/orders">
                        <Button className="rounded-full h-12 px-8 gap-2 w-full sm:w-auto text-lg shadow-lg hover:shadow-xl transition-all">
                            <Package className="w-5 h-5" />
                            View Order Tracking
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button variant="outline" className="rounded-full h-12 px-8 gap-2 w-full sm:w-auto text-lg border-2">
                            <ShoppingBag className="w-5 h-5" />
                            Keep Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
