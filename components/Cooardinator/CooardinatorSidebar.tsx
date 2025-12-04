"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Calendar,
    BookOpen,
    LogOut,
    Shield,
} from "lucide-react";

export default function CoordinatorSidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Event Boards", href: "/cooardinator/events", icon: Calendar },
        { name: "Open Registration", href: "/cooardinator/registration", icon: BookOpen },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col 
            bg-gradient-to-b from-[#0f172a] to-[#1e293b] 
            text-white border-r border-slate-700 shadow-xl z-50">

           {/* Logo */}
<div className="p-6 border-b border-slate-700 bg-slate-900/40 backdrop-blur-sm flex items-center gap-3">
    <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md shadow-blue-900/20 bg-slate-800 flex items-center justify-center">
        <img 
            src="/sjc_logo.png" 
            alt="Coordinator Logo" 
            className="w-10 h-10 object-contain"
        />
    </div>

    <div>
        <h1 className="font-semibold text-lg tracking-wide">COOARDINATOR</h1>
        <p className="text-xs text-slate-400">Control Panel</p>
    </div>
</div>


            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === pathname;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl 
                               text-red-400 hover:bg-red-600/10 hover:text-red-300 
                               transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>

        </aside>
    );
}
