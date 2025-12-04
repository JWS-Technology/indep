"use client";

import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";

export default function coordinatorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <CoordinatorSidebar />

            {/* Content Area */}
            <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-10">
                {children}
            </main>
        </div>
    );
}
