"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        const lastVisit = localStorage.getItem("lastVisit");
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000;

        // Count only once every 15 minutes
        if (!lastVisit || now - parseInt(lastVisit) > fifteenMinutes) {
            fetch("/api/track");
            localStorage.setItem("lastVisit", now.toString());
        }

        // Always fetch updated count
        fetch("/api/track-count")
            .then(res => res.json())
            .then(data => {
                setIsCounting(true);

                let start = 0;
                const end = data.total;
                const duration = 2000;
                const increment = end / (duration / 16);

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= end) {
                        setCount(end);
                        setIsCounting(false);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            });
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-3 border border-white/30 shadow-2xl hover:bg-black/70 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className={`w-5 h-5 text-yellow-300 ${isCounting ? 'animate-pulse' : ''}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
                    </div>

                    <p className="text-sm font-bold text-white">
                        {count.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
