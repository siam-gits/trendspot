"use client";

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
}

export function Logo({ className = "", iconClassName = "", textClassName = "", showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            {/* The Focus Mark Icon */}
            <div className={`w-9 h-9 rounded-xl bg-foreground flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:shadow-lg group-hover:shadow-foreground/10 ${iconClassName}`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-background"
                >
                    {/* Trend Line */}
                    <path
                        d="M12 4V20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {/* The Spot (Circle) with Break */}
                    <path
                        d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 11.2 16.8 10.4 16.4 9.8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {/* Accent Dot */}
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
            </div>

            {showText && (
                <span className={`brand-typography font-semibold text-xl tracking-[0.2em] transition-colors duration-300 group-hover:text-foreground/80 ${textClassName}`}>
                    trendspot
                </span>
            )}
        </div>
    );
}
