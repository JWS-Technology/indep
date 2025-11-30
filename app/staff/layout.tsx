"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  Settings,
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
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

          {/* User Info & Logout - After navigation buttons in sidebar */}
          <div className="mt-8 px-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
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
              <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-gray-300 bg-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar - Hidden on Desktop */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-40 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                SU
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Bar with User Info & Sign Out */}
        <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-sm">SU</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Staff User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}