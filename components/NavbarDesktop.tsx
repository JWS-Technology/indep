"use client";
import Link from "next/link";

interface NavItem {
    name: string;
    href: string;
    icon: string;
}

interface NavbarDesktopProps {
    navItems: NavItem[];
}

export default function NavbarDesktop({ navItems }: NavbarDesktopProps) {
    return (
        <>
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
                    >
                        <div className="flex items-center space-x-2">
                            <span>{item.name}</span>
                        </div>

                        {/* Original Hover Underline Effect */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4"></div>

                        {/* Original Hover Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
                    </Link>
                ))}
            </div>

            {/* Desktop Auth Buttons (Original Styling) */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
                <Link
                    href="/login"
                    className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hover:bg-gray-100 rounded-xl"
                >
                    Sign In
                </Link>
                <Link
                    href="/register"
                    className="relative px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center space-x-2">
                        <span>Register</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                </Link>
            </div>
        </>
    );
}