"use client";

import { 
  X, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Calendar,
  FileText,
  Trophy,
  Bell,
  ClipboardCheck,
  UserCircle,
  ChevronRight
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
    const pathname = usePathname();

    const navItems = [
        { icon: <Home size={20} />, label: "Dashboard", href: "/team/dashboard" },
        { icon: <ClipboardCheck size={20} />, label: "Registration", href: "/team/registration" },
        // { icon: <Calendar size={20} />, label: "Events", href: "/team/events" },
        // { icon: <Users size={20} />, label: "Team Members", href: "/team/members" },
        // { icon: <Trophy size={20} />, label: "Results", href: "/team/results" },
        // { icon: <FileText size={20} />, label: "Documents", href: "/team/documents" },
        // { icon: <Bell size={20} />, label: "Notifications", href: "/team/notifications" },
        // { icon: <UserCircle size={20} />, label: "Profile", href: "/team/profile" },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    const isActive = (href: string) => {
        if (href === "/team/dashboard") {
            return pathname === href || pathname === "/team";
        }
        return pathname.startsWith(href);
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
                {/* Header - EXACT OLDER VERSION */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <LayoutDashboard className="w-7 h-7 text-indigo-600 mr-3" />
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">INDEP &apos;25</h1>
                    <button className="ml-auto md:hidden text-gray-500" onClick={() => setOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation - UPDATED BUTTONS */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">
                        Menu
                    </p>
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => window.innerWidth < 768 && setOpen(false)}
                                    className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                        ${active 
                                            ? "bg-indigo-50 text-indigo-600 shadow-sm border-l-3 border-indigo-500" 
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`${active ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`${active ? "font-semibold" : "font-medium"}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {active && (
                                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Footer - EXACT OLDER VERSION */}
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