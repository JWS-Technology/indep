"use client";

import CooardinatorSidebar from "@/components/Cooardinator/CooardinatorSidebar";

export default function cooardinatorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            {/* Sidebar */}
            <CooardinatorSidebar />

            {/* Content Area */}
            <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-10">
                {children}
            </main>
        </div>
    );
}
