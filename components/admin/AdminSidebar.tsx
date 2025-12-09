"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Users,
    UserPlus,
    Calendar,
    LogOut,
    Shield,
    Upload,
    Image as ImageIcon,
    ChevronDown,
    ChevronRight,
    List,
    Ticket,
    BookOpen,
    Menu,
    X,
    Settings,
    Bell,
    UserCircle,
    GraduationCap,
    FolderOpen,
    CheckSquare
} from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Close sidebar function
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Close sidebar on route change
    useEffect(() => {
        closeSidebar();
    }, [pathname]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!sidebarOpen) return;
            
            const isOutsideSidebar = sidebarRef.current && 
                !sidebarRef.current.contains(event.target as Node);
            
            const isOutsideMenuButton = menuButtonRef.current && 
                !menuButtonRef.current.contains(event.target as Node);
            
            if (isOutsideSidebar && isOutsideMenuButton) {
                closeSidebar();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen]);

    const toggleMenu = (menuName: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        {
            name: "User Management",
            icon: Users,
            href: "#",
            subItems: [
                { name: "All Users", href: "/admin/users", icon: List },
                { name: "Students", href: "/admin/users/student", icon: GraduationCap },
                { name: "Faculty", href: "/admin/users/faculty", icon: UserCircle },
            ],
        },
        { name: "Coordinators", href: "/admin/manage-coordinator", icon: Users },
        { name: "Teams", href: "/admin/manage-teams", icon: Users },
        { name: "Create User", href: "/admin/create-user", icon: UserPlus },
        { name: "Manage Events", href: "/admin/events", icon: Calendar },
        { name: "Open Registration", href: "/admin/registration", icon: BookOpen },
        {
            name: "Lot",
            icon: Ticket,
            href: "#",
            subItems: [
                { name: "Add Lot", href: "/admin/lot/select-event", icon: Ticket },
                { name: "All Lots", href: "/admin/lot/lots-allocation", icon: List },
            ],
        },
        { name: "Attendance", href: "/admin/attendance", icon: CheckSquare },
        {
            name: "Gallery",
            icon: ImageIcon,
            href: "#",
            subItems: [
                { name: "Manage Gallery", href: "/admin/gallery", icon: FolderOpen },
                { name: "Upload Image", href: "/admin/upload-gallery", icon: Upload },
            ],
        },
        { name: "Upload All Files", href: "/admin/upload-all-files", icon: Upload },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile Header - White theme */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-[100] flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        ref={menuButtonRef}
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {sidebarOpen ? (
                            <X size={24} className="text-gray-700" />
                        ) : (
                            <Menu size={24} className="text-gray-700" />
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <Shield size={18} className="text-white" />
                        </div>
                        <h1 className="font-bold text-gray-900 text-lg">INDEP ADMIN</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Sidebar - Dark theme like original */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white
                    z-[99] transform transition-transform duration-300 ease-in-out
                    shadow-2xl lg:shadow-none
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Sidebar Header - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block p-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-xl tracking-tight">INDEP ADMIN</h1>
                            <p className="text-slate-400 text-sm">Control Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 h-[calc(100vh-120px)] lg:h-[calc(100vh-200px)] overflow-y-auto">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = 
                                item.href === pathname ||
                                (item.href !== "#" && pathname.startsWith(item.href)) ||
                                item.subItems?.some(sub => pathname === sub.href);

                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isOpen = openMenus[item.name];

                            if (hasSubItems) {
                                return (
                                    <div key={item.name} className="space-y-1">
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                isActive
                                                    ? "bg-slate-800 text-white border border-slate-700"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    size={20}
                                                    className={
                                                        isActive
                                                            ? "text-indigo-400"
                                                            : "text-slate-400 group-hover:text-white"
                                                    }
                                                />
                                                <span className="font-medium text-sm">{item.name}</span>
                                            </div>
                                            {isOpen ? (
                                                <ChevronDown size={16} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                                            ) : (
                                                <ChevronRight size={16} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="ml-12 space-y-1">
                                                {item.subItems.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    const isSubActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            onClick={closeSidebar}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                                isSubActive
                                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                            }`}
                                                        >
                                                            <SubIcon
                                                                size={16}
                                                                className={isSubActive ? "text-white" : "text-slate-400"}
                                                            />
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
                                    onClick={closeSidebar}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                        }
                                    />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-800">
                    <button
                        onClick={() => {
                            handleLogout();
                            closeSidebar();
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[98] lg:hidden"
                    onClick={closeSidebar}
                />
            )}
        </>
    );
}