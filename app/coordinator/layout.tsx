"use client";

import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <CoordinatorSidebar />

            {/* Content Area */}
            <main className="flex-1 ml-64 p-8 md:p-12 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}