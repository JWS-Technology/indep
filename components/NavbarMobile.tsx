"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; // Import hamburger/close icons
import type { NavItem } from "./Navbar";
import Image from "next/image";

type Props = {
    navItems: NavItem[];
};

const NavbarMobile: React.FC<Props> = ({ navItems }) => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef<HTMLElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => { setOpen(false); }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open && navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [open]);

    return (
        <nav
            ref={navRef}
            className={`
        md:hidden fixed left-1/2 -translate-x-1/2 z-50
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        rounded-3xl border border-white/20
        ${scrolled
                    ? "top-4 w-[75vw] bg-white/70 backdrop-blur-xl shadow-xl py-3 px-5"
                    : "top-6 w-[90vw] bg-white/90 backdrop-blur-lg shadow-lg py-4 px-6"
                }
        ${open ? "bg-white ring-1 ring-gray-100 w-[85vw]" : ""}
      `}
        >
            <div className="flex items-center justify-between relative z-20">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                    <div className="relative w-9 h-9 overflow-hidden ">
                        <Image
                            src={"/logo.png"}
                            alt="INDEP Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className={`font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>
                        INDEP '25
                    </span>
                </Link>

                {/* Hamburger Toggle */}
                <button
                    onClick={() => setOpen((s) => !s)}
                    className="text-gray-600 hover:text-blue-600 focus:outline-none transition-all duration-300"
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <div
                className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${open ? "max-h-[500px] opacity-100 mt-6 pb-2" : "max-h-0 opacity-0 mt-0"}
        `}
            >
                <div className="flex flex-col">
                    {/* Links Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
                    ${isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
                                        }
                  `}
                                    style={{ transitionDelay: open ? `${index * 50}ms` : "0ms" }}
                                >
                                    {/* Render Lucide Icon directly */}
                                    <span className="mb-2 text-blue-500/80">{item.icon}</span>
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Auth */}
                    <div className="flex gap-3 border-t border-gray-100 pt-4">
                        <Link href="/login" className="flex-1 py-3 text-center text-gray-600 font-semibold bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            Sign In
                        </Link>
                     
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-[-1] bg-black/5 backdrop-blur-[1px] transition-opacity duration-500 rounded-3xl"
                    onClick={() => setOpen(false)}
                />
            )}
        </nav>
    );
};

export default NavbarMobile;