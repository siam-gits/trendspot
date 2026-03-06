"use client";

import { useCartStore } from "@/store/cartStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "@/actions/checkout";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CartSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, removeItem, updateQuantity, totalPrice, clearCart } =
        useCartStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!session) {
            toast.info("Please sign in to checkout");
            onOpenChange(false);
            router.push("/sign-in");
            return;
        }
        if (items.length === 0) return;
        setIsCheckingOut(true);
        try {
            const cartItems = items.map((item) => ({
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnail,
                quantity: item.quantity,
            }));

            const { sessionId, url } = await createCheckoutSession(cartItems);

            if (url) {
                clearCart();
                window.location.href = url;
            } else if (sessionId) {
                const stripe = await stripePromise;
                if (stripe) {
                    clearCart();
                    const { error } = await (stripe as any).redirectToCheckout({ sessionId });
                    if (error) toast.error(error.message);
                }
            }
        } catch (error) {
            console.error("Checkout process error:", error);
            toast.error("Checkout failed. Please try again or check console for details.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart
                        {items.length > 0 && (
                            <span className="ml-auto text-sm font-normal text-muted-foreground">
                                {items.reduce((s, i) => s + i.quantity, 0)} item
                                {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Add some products to get started
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex gap-3">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={item.product.thumbnail}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {item.product.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ${item.product.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    updateQuantity(item.product.id, item.quantity - 1)
                                                }
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="text-sm w-6 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="w-6 h-6"
                                                onClick={() =>
                                                    updateQuantity(item.product.id, item.quantity + 1)
                                                }
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-6 h-6 ml-auto text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItem(item.product.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-right">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto space-y-4">
                            <Separator />
                            <div className="flex items-center justify-between font-semibold">
                                <span>Subtotal</span>
                                <span>${totalPrice().toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Test mode • Use card 4242 4242 4242 4242
                            </p>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? "Processing..." : "Checkout with Stripe"}
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
