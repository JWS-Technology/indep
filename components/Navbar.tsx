"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export type NavItem = {
    name: string;
    href: string;
    icon: string;
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    // Scroll detection logic
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Data definition
    const navItems: NavItem[] = [
        { name: "Home", href: "/", icon: "🏠" },
        { name: "Events", href: "/events", icon: "🎭" },
        { name: "Teams", href: "/teams", icon: "👥" },
        { name: "Schedule", href: "/schedule", icon: "📅" },
        { name: "Gallery", href: "/gallery", icon: "🖼️" },
        { name: "Contact", href: "/contact", icon: "📞" },
    ];

    return (
        // We use a fixed container with pointer-events-none so the empty space 
        // around the floating navbar doesn't block clicks on the page behind it.
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-4 pointer-events-none">

            {/* Desktop Container:
         - Hidden on mobile
         - Pointer events auto re-enables clicking
         - Dynamic width based on scroll
      */}
            <div
                className={`hidden lg:flex items-center justify-between rounded-full bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl transition-all duration-500 pointer-events-auto
        ${scrolled ? "w-[70vw] py-3 px-6" : "w-[95vw] py-4 px-8"}`}
            >
                <Logo scrolled={scrolled} />
                <NavbarDesktop navItems={navItems} />
            </div>

            {/* Mobile Container:
         - Hidden on Desktop
         - Pointer events auto
         - Full width but with padding
      */}
            <div className="lg:hidden w-full px-4 pointer-events-auto">
                <NavbarMobile navItems={navItems} scrolled={scrolled} />
            </div>

        </div>
    );
}

// Extracted Logo component since it's used in both views or just the main wrapper
const Logo = ({ scrolled }: { scrolled: boolean }) => (
    <Link href="/" className="flex items-center space-x-3 group">
        <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">I</span>
            </div>
        </div>
        <div className="flex flex-col">
            <span className={`font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
                INDEP &apos;25
            </span>
        </div>
    </Link>
);