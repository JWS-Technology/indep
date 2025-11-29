"use client";
import React from "react";
import {
    Home,
    Drama,
    Users,
    CalendarDays,
    Images,
    Phone
} from "lucide-react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export type NavItem = {
    name: string;
    href: string;
    icon: React.ReactNode;
};

export default function Navbar() {
    const navItems: NavItem[] = [
        { name: "Home", href: "/", icon: <Home size={20} /> },
        { name: "Events", href: "/events", icon: <Drama size={20} /> },
        { name: "Teams", href: "/teams", icon: <Users size={20} /> },
        { name: "Schedule", href: "/schedule", icon: <CalendarDays size={20} /> },
        { name: "Gallery", href: "/gallery", icon: <Images size={20} /> },
        { name: "Contact", href: "/contact", icon: <Phone size={20} /> },
    ];

    return (
        // Pointer-events-none on container to let clicks pass through the empty areas
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-4 pointer-events-none">

            {/* Desktop Container */}
            <div className="hidden lg:block w-full pointer-events-auto">
                <NavbarDesktop navItems={navItems} />
            </div>

            {/* Mobile Container */}
            <div className="lg:hidden w-full pointer-events-auto">
                <NavbarMobile navItems={navItems} />
            </div>

        </div>
    );
}