"use client";

import { X, Home, Users, Settings, LogOut, LayoutDashboard } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
    const pathname = usePathname();

    const navItems = [
        { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
        // { icon: <Users size={20} />, label: "Members", href: "/members" }, // Example
        // { icon: <Settings size={20} />, label: "Settings", href: "/settings" }, // Example
    ];
    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };
    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar Aside */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 
        transition-transform duration-300 ease-in-out w-64
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <LayoutDashboard className="w-7 h-7 text-indigo-600 mr-3" />
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">INDEP &apos;25</h1>
                    <button className="ml-auto md:hidden text-gray-500" onClick={() => setOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Menu</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href="#" // Replace with item.href in real app
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
              ${pathname === item.href || item.label === "Dashboard" // Mock active state
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

