"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    LogOut,
    Users,
    X,
    File
} from "lucide-react";

interface SidebarProps {
    open: boolean;
    setOpen: (v: boolean) => void;
}

export default function CoordinatorSidebar({ open, setOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/coordinator/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        // { name: "Dashboard", href: "/coordinator/dashboard", icon: LayoutDashboard },
        { name: "My Events", href: "/coordinator/events", icon: Calendar },
        { name: "Uploaded Files", href: "/coordinator/my-files", icon: File },
        { name: "Users", href: "/coordinator/team-users", icon: Users },
        // Add other items here
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar Aside */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 flex flex-col shadow-xl transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
                            INDEP '25
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold leading-none">
                            Coordinator
                        </p>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)} // Close sidebar on mobile when link clicked
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                                />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}