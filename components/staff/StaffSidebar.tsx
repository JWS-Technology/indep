"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Settings,
  ChevronRight,
  LogOut,
  X
} from "lucide-react";

interface StaffSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function StaffSidebar({ sidebarOpen, setSidebarOpen }: StaffSidebarProps) {
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    { 
      name: "Dashboard", 
      href: "/staff/dashboard", 
      icon: LayoutDashboard, 
      color: "blue" 
    },
    { 
      name: "Create Team", 
      href: "/staff/team/create", 
      icon: UserPlus, 
      color: "green" 
    },
    { 
      name: "View Teams", 
      href: "/staff/teams", 
      icon: Users, 
      color: "purple" 
    },
    { 
      name: "Students", 
      href: "/staff/students", 
      icon: Users, 
      color: "orange" 
    },
    { 
      name: "Reports", 
      href: "/staff/reports", 
      icon: FileText, 
      color: "indigo" 
    },
    { 
      name: "Settings", 
      href: "/staff/settings", 
      icon: Settings, 
      color: "gray" 
    },
  ];

  const isActive = (href: string) => pathname === href;

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100" 
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100",
      green: isActive 
        ? "bg-green-50 text-green-700 border-green-200 shadow-green-100" 
        : "text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-100",
      purple: isActive 
        ? "bg-purple-50 text-purple-700 border-purple-200 shadow-purple-100" 
        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100",
      orange: isActive 
        ? "bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100" 
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100",
      indigo: isActive 
        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100" 
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100",
      gray: isActive 
        ? "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100" 
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? "text-blue-600" : "text-gray-400",
      green: isActive ? "text-green-600" : "text-gray-400",
      purple: isActive ? "text-purple-600" : "text-gray-400",
      orange: isActive ? "text-orange-600" : "text-gray-400",
      indigo: isActive ? "text-indigo-600" : "text-gray-400",
      gray: isActive ? "text-gray-600" : "text-gray-400",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo Section */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
              <span className="text-white font-bold text-lg">SJ</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Staff Portal</h1>
              <p className="text-blue-100 text-xs">INDEP 2025</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation - Completely static, no flex for scrolling */}
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* Navigation Items - Fixed height */}
        <div className="flex-1 py-4">
          <nav className="px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 border ${
                      getColorClasses(item.color, isActive(item.href))
                    } ${isActive(item.href) ? 'shadow-sm' : 'hover:shadow'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive(item.href) 
                        ? item.color === 'blue' ? 'bg-blue-100' : 
                          item.color === 'green' ? 'bg-green-100' :
                          item.color === 'purple' ? 'bg-purple-100' :
                          item.color === 'orange' ? 'bg-orange-100' :
                          item.color === 'indigo' ? 'bg-indigo-100' : 'bg-gray-100'
                        : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${getIconColor(item.color, isActive(item.href))}`} />
                    </div>
                    <span className="flex-1 ml-3">{item.name}</span>
                    {isActive(item.href) && (
                      <ChevronRight className="w-4 h-4 text-current" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User Info & Logout - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-sm">SU</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Staff User</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}