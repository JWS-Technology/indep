"use client";

import { useEffect, useState } from "react";
import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

export default function Hero() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const eventDate = new Date("2025-12-12T00:00:00");

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = eventDate.getTime() - now;

            if (diff <= 0) {
                setIsEventStarted(true);
                clearInterval(timer);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <div className="hidden lg:block">
                <HeroDesktop timeLeft={timeLeft} isEventStarted={isEventStarted} />
            </div>
            <div className="lg:hidden">
                <HeroMobile timeLeft={timeLeft} isEventStarted={isEventStarted} />
            </div>
        </>
    );
}