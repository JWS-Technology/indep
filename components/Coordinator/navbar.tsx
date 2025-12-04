"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Loader2 } from "lucide-react";

interface NavbarProps {
    setOpen: (v: boolean) => void;
}

interface CoordinatorData {
    name: string;
    dNo?: string;
    collegeId?: string;
    department?: string;
}

export function CoordinatorNavbar({ setOpen }: NavbarProps) {
    const [coord, setCoord] = useState<CoordinatorData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoordinator = async () => {
            try {
                const res = await fetch("/api/coordinator/getMe");
                const data = await res.json();

                if (data.success) {
                    // Fallback: check 'coordinator' object, then 'user' object
                    setCoord(data.coordinator || data.user);
                }
            } catch (error) {
                console.error("Failed to fetch coordinator profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoordinator();
    }, []);

    // Determine the ID to use for the image (prefer collegeId, fallback to dNo)
    const imageId = coord?.collegeId || coord?.dNo;

    return (
        <header className="sticky top-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 h-16 flex items-center transition-all duration-300">
            <div className="w-full px-4 md:px-6 flex items-center justify-between">

                {/* Left Side: Mobile Menu Toggle & Brand */}
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Mobile Only Logo (visible when sidebar is hidden) */}
                    <div className="md:hidden font-black text-lg text-slate-800 tracking-tight">
                        INDEP '25
                    </div>
                </div>

                {/* Right Side: Profile Info */}
                <div className="flex items-center gap-4">

                    {/* Text Details (Hidden on mobile) */}
                    <div className="hidden md:block text-right">
                        {loading ? (
                            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-slate-700">
                                    {coord?.name || "Coordinator"}
                                </p>
                                <p className="text-xs text-slate-500 uppercase font-medium">
                                    {coord?.department || imageId || "Coordinator Panel"}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Profile Image */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <Image
                                src={
                                    imageId
                                        ? `https://sjctni.edu/images/SPhotos/${imageId.substring(0, 2)}/${imageId.toLowerCase()}.jpg`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(coord?.name || "User")}&background=random`
                                }
                                alt={coord?.name || "Profile"}
                                fill
                                sizes="40px"
                                className="object"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.srcset = ""; // Prevent Next.js from using the broken srcset
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coord?.name || "User")}&background=random`;
                                }}
                            />
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}