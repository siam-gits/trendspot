"use client";

import { useState } from "react";
import { MessageCircle, X, MessageSquare, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);

    const contactOptions = [
        {
            name: "WhatsApp",
            icon: <Phone className="w-5 h-5" />,
            color: "bg-[#25D366]",
            href: "https://wa.me/your-number", // Placeholder
            label: "Chat on WhatsApp"
        },
        {
            name: "Messenger",
            icon: <MessageSquare className="w-5 h-5" />,
            color: "bg-[#0084FF]",
            href: "https://m.me/your-id", // Placeholder
            label: "Chat on Messenger"
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-card border border-border/50 rounded-2xl p-4 shadow-2xl w-64 space-y-3 mb-2"
                    >
                        <div className="pb-2 border-b border-border/50">
                            <h3 className="font-semibold text-sm">Chat with us</h3>
                            <p className="text-xs text-muted-foreground">We usually respond in a few minutes.</p>
                        </div>
                        <div className="space-y-2">
                            {contactOptions.map((option) => (
                                <a
                                    key={option.name}
                                    href={option.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                                >
                                    <div className={`${option.color} text-white p-2 rounded-lg`}>
                                        {option.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{option.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{option.label}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                className="w-14 h-14 rounded-full shadow-2xl transition-transform active:scale-90"
                onClick={() => setIsOpen(!isOpen)}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </motion.div>
            </Button>
        </div>
    );
}
