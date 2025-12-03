"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { NavItem } from "./Navbar";
import Image from "next/image";

interface NavbarDesktopProps {
    navItems: NavItem[];
}

export default function NavbarDesktop({ navItems }: NavbarDesktopProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`
        hidden lg:flex fixed left-1/2 -translate-x-1/2 z-50 items-center justify-between 
        rounded-full border border-white/40 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${scrolled
                    ? "top-4 w-[70vw] bg-white/90 backdrop-blur-xl py-3 px-6"
                    : "top-6 w-[95vw] bg-white/80 backdrop-blur-lg py-4 px-8"
                }
      `}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                    <div className="relative w-9 h-9 overflow-hidden ">
                        <Image
                            src={"/logo.png"}
                            alt="INDEP Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className={`font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>
                        INDEP &apos;25
                    </span>
                </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
                    >
                        <div className="flex items-center space-x-2">
                            {/* Note: We typically don't show icons on desktop for this style, but you can uncomment below if you want them */}
                            {/* <span className="text-blue-500">{item.icon}</span> */}
                            <span>{item.name}</span>
                        </div>

                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
                    </Link>
                ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4">
                <Link
                    href="/login"
                    className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hover:bg-gray-100 rounded-xl"
                >
                    Sign In
                </Link>
                
                 
            </div>
        </div>
    );
}