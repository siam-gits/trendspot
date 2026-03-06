"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartInitializer } from "@/components/CartInitializer";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <CartInitializer />
                {children}
                <Toaster position="bottom-right" richColors />
            </SessionProvider>
        </ThemeProvider>
    );
}
