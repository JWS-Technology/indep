"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import StaffSidebar from "@/components/staff/StaffSidebar";
import StaffHeader from "@/components/staff/StaffHeader";
import MobileBottomBar from "@/components/staff/MobileBottomBar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard" },
    { name: "Create Team", href: "/staff/team/create" },
    { name: "View Teams", href: "/staff/teams" },
    { name: "Students", href: "/staff/students" },
    { name: "Reports", href: "/staff/reports" },
    { name: "Settings", href: "/staff/settings" },
  ];

  const currentPage = navigation.find(item => pathname === item.href)?.name || "Dashboard";

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sidebar - Completely static, no scrolling possible */}
      <StaffSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area - Only this area scrolls */}
      <div className="flex-1 flex flex-col min-h-0 lg:ml-0">
        {/* Top Bar - Hidden on Desktop */}
        <StaffHeader setSidebarOpen={setSidebarOpen} currentPage={currentPage} />

        {/* Page Content - This is the ONLY scrollable area */}
        <div className="flex-1 min-h-0 overflow-auto">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Bar with User Info & Sign Out */}
        <MobileBottomBar />
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