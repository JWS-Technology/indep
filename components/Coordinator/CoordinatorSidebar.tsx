"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    LogOut,
    UserCog,
    Trophy
} from "lucide-react";

export default function CoordinatorSidebar() {
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
        { name: "Dashboard", href: "/coordinator/dashboard", icon: LayoutDashboard },
        { name: "My Events", href: "/coordinator/events", icon: Calendar },
        // { name: "Participants", href: "/coordinator/students", icon: Users },
        // { name: "Results", href: "/coordinator/results", icon: Trophy },
        // { name: "Profile", href: "/coordinator/profile", icon: UserCog },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
                    INDEP '25
                </h1>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Coordinator Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
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
    );
}