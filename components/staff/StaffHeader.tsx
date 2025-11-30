"use client";

import { Bell, Menu, LogOut } from "lucide-react";

interface StaffHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
}

export default function StaffHeader({ setSidebarOpen, currentPage }: StaffHeaderProps) {
  return (
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
            {currentPage}
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
  );
}