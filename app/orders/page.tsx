"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/actions/orders";
import { ShoppingBag, Package, Calendar, Tag, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getUserOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center max-w-md">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                    <Package className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-2">No orders found</h1>
                <p className="text-muted-foreground mb-8">
                    You haven&apos;t placed any orders yet. Start exploring our premium collection!
                </p>
                <Link href="/products">
                    <Button className="rounded-full px-8 h-12">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <Package className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">Track and manage your recent purchases</p>
                </div>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="p-6 bg-muted/30 border-b flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Date Placed</p>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Order #</p>
                                    <div className="flex items-center gap-2 text-sm font-medium font-mono">
                                        {order._id.substring(order._id.length - 8).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-sm font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <Badge className={`rounded-full px-4 py-1 text-xs capitalize ${order.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-muted text-muted-foreground'
                                }`}>
                                {order.status}
                            </Badge>
                        </div>

                        {/* Items */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-xl border bg-muted overflow-hidden flex-shrink-0">
                                            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Status Timeline Hint */}
                        <div className="px-6 py-4 bg-muted/10 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Track your shipment status here soon</span>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-full gap-1 group">
                                View Details
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
