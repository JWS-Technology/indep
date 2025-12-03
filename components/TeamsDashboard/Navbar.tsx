"use client";

import { Menu, LayoutDashboard } from "lucide-react";

export function Navbar({ setOpen, teamName }: { setOpen: (v: boolean) => void; teamName: string; }) {
    const initials = teamName
        ?.split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
    return (
        <header className="sticky top-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-30 h-16 flex items-center transition-all duration-300">
            <div className="w-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="md:hidden flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <LayoutDashboard className="w-6 h-6" />
                        <span>INDEP</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-gray-700">{teamName}</p>
                        <p className="text-xs text-gray-500">Team Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}