"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./Navbar";

type Props = {
    navItems: NavItem[];
    scrolled: boolean;
};

export default function NavbarMobile({ navItems, scrolled }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <nav
            ref={menuRef}
            className={`
        relative rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${scrolled ? "shadow-xl" : "shadow-lg"}
        ${open ? "bg-white" : "bg-white/90 backdrop-blur-md"}
      `}
        >
            {/* Bar Header */}
            <div className="flex items-center justify-between px-6 py-4">

                {/* Mobile Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
                    <span className="font-bold text-gray-900">INDEP</span>
                </Link>

                {/* Hamburger Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 flex flex-col justify-between relative">
                        <span className={`h-0.5 w-6 bg-gray-800 rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-2.5" : ""}`} />
                        <span className={`h-0.5 w-6 bg-gray-800 rounded-full transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
                        <span className={`h-0.5 w-6 bg-gray-800 rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
                    </div>
                </button>
            </div>

            {/* Expandable Menu Content */}
            <div
                className={`
          overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
            >
                <div className="px-4 pb-6 pt-2">

                    {/* Navigation Links Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {navItems.map((item, idx) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
                    ${isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
                                        }
                  `}
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                >
                                    <span className="text-2xl mb-1">{item.icon}</span>
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Auth Buttons */}
                    <div className="flex gap-3 border-t border-gray-100 pt-5">
                        <Link
                            href="/login"
                            className="flex-1 py-3 text-center text-gray-700 font-semibold bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="flex-1 py-3 text-center text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            Register
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}