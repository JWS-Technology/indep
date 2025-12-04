"use client";

import { useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/sidebar"; // adjust path
import { CoordinatorNavbar } from "@/components/Coordinator/navbar"; // adjust path

export default function CoordinatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <CoordinatorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">

                {/* Navbar */}
                <CoordinatorNavbar
                    setOpen={setSidebarOpen}
                    coordinatorName="John Doe"
                    department="23UBC506"
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}