"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export function CartInitializer() {
    const { data: session, status } = useSession();
    const fetchCart = useCartStore((state: any) => state.fetchCart);
    const isHydrated = useCartStore((state: any) => state.isHydrated);

    useEffect(() => {
        if (status !== "loading") {
            fetchCart();
        }
    }, [session, status, fetchCart]);

    return null;
}
