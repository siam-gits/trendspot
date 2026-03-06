import { create } from "zustand";
import { Product } from "@/lib/api";
import { syncCart, getCart } from "@/actions/cart";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isHydrated: boolean;
    addItem: (product: Product) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isHydrated: false,

    fetchCart: async () => {
        try {
            const serverItems = await getCart();
            if (serverItems) {
                set({ items: serverItems, isHydrated: true });
            } else {
                // Fallback to local storage or empty if no server cart
                const local = typeof window !== 'undefined' ? localStorage.getItem('trendspot-cart-v2') : null;
                if (local) {
                    set({ items: JSON.parse(local), isHydrated: true });
                } else {
                    set({ isHydrated: true });
                }
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            set({ isHydrated: true });
        }
    },

    addItem: async (product: Product) => {
        const existing = get().items.find(
            (item) => item.product.id === product.id
        );
        let newItems;
        if (existing) {
            newItems = get().items.map((item) =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newItems = [...get().items, { product, quantity: 1 }];
        }

        set({ items: newItems });
        if (typeof window !== 'undefined') localStorage.setItem('trendspot-cart-v2', JSON.stringify(newItems));
        await syncCart(newItems);
    },

    removeItem: async (productId: number) => {
        const newItems = get().items.filter((item) => item.product.id !== productId);
        set({ items: newItems });
        if (typeof window !== 'undefined') localStorage.setItem('trendspot-cart-v2', JSON.stringify(newItems));
        await syncCart(newItems);
    },

    updateQuantity: async (productId: number, quantity: number) => {
        if (quantity <= 0) {
            await get().removeItem(productId);
            return;
        }
        const newItems = get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems });
        if (typeof window !== 'undefined') localStorage.setItem('trendspot-cart-v2', JSON.stringify(newItems));
        await syncCart(newItems);
    },

    clearCart: async () => {
        set({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('trendspot-cart-v2');
        await syncCart([]);
    },

    totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: () =>
        get().items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        ),
}));
