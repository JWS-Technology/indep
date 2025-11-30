"use client";

import { LogOut } from "lucide-react";

export default function MobileBottomBar() {
  return (
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
  );
}