"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Calendar,
    Settings,
    LogOut,
    Shield,
    Upload,
    Files,
    Image as ImageIcon,
    ChevronDown,
    ChevronRight,
    List,
    Ticket,
    BookOpen,
} from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (name: string) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        {
            name: "User Management",
            icon: Users,
            href: "#",
            subItems: [
                { name: "All Users", href: "/admin/users", icon: List },
                { name: "Students", href: "/admin/users/student", icon: ChevronRight },
                { name: "Faculty", href: "/admin/users/faculty", icon: ChevronRight },
                // { name: "Admins", href: "/admin/users/admin", icon: Shield },
            ]
        },
        { name: "Coordinators", href: "/admin/manage-coordinator", icon: Users },
        { name: "Teams", href: "/admin/manage-teams", icon: Users },
        { name: "Create User", href: "/admin/create-user", icon: UserPlus },
        { name: "Manage Events", href: "/admin/events", icon: Calendar },
        { name: "Open Registration", href: "/admin/registration", icon: BookOpen },
        { name: "Add Lot", href: "/admin/lot/select-event", icon: Ticket },
        {
            name: "Gallery",
            icon: ImageIcon,
            href: "#", // Parent item
            subItems: [
                { name: "Manage Gallery", href: "/admin/gallery", icon: List },
                { name: "Upload Image", href: "/admin/upload-gallery", icon: Upload },
            ],
        },
        // { name: "Files", href: "/admin/files", icon: Files },

        // { name: "Lot", href: "/admin/lot/select-event", icon: Ticket },
        // { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-wide">INDEP ADMIN</h1>
                    <p className="text-xs text-slate-400">Control Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Check if this item (or its sub-items) is currently active
                    const isActive =
                        item.href === pathname ||
                        item.subItems?.some((sub) => sub.href === pathname);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isOpen = openMenus[item.name];

                    if (hasSubItems) {
                        return (
                            <div key={item.name} className="space-y-1">
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-slate-800 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            size={20}
                                            className={
                                                isActive
                                                    ? "text-blue-400"
                                                    : "text-slate-500 group-hover:text-white"
                                            }
                                        />
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className="pl-4 space-y-1">
                                        {item.subItems!.map((sub) => {
                                            const SubIcon = sub.icon;
                                            const isSubActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isSubActive
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                        }`}
                                                >
                                                    {SubIcon && (
                                                        <SubIcon
                                                            size={16}
                                                            className={
                                                                isSubActive ? "text-white" : "text-slate-500"
                                                            }
                                                        />
                                                    )}
                                                    <span className="font-medium text-sm">
                                                        {sub.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon
                                size={20}
                                className={
                                    isActive
                                        ? "text-white"
                                        : "text-slate-500 group-hover:text-white"
                                }
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
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
