'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'About', href: '/about', icon: 'ℹ️' },
        { name: 'Events', href: '/events', icon: '🎭' },
        { name: 'Teams', href: '/teams', icon: '👥' },
        { name: 'Schedule', href: '/schedule', icon: '📅' },
        { name: 'Gallery', href: '/gallery', icon: '🖼️' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 rounded-b-3xl ${
            scrolled 
                ? 'bg-white/98 backdrop-blur-xl border-b border-gray-200/60 shadow-xl' 
                : 'bg-white/95 backdrop-blur-lg border-b border-gray-200/40'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <span className="text-white font-bold text-xl">I</span>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
                                    scrolled ? 'text-xl' : 'text-2xl'
                                }`}>
                                    INDEP 2025
                                </span>
                                <span className="text-xs text-gray-500 font-medium -mt-1">
                                    Cultural Extravaganza
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group"
                            >
                                <div className="flex items-center space-x-2">
                                    {/* <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                                        {item.icon}
                                    </span> */}
                                    <span>{item.name}</span>
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <a
                            href="/login"
                            className="px-6 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hover:bg-gray-100 rounded-xl"
                        >
                            Sign In
                        </a>
                        <a
                            href="/register"
                            className="relative px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center space-x-2">
                                <span>Register</span>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-3 rounded-2xl transition-all duration-300 ${
                                scrolled 
                                    ? 'bg-gray-100 hover:bg-gray-200' 
                                    : 'bg-white/90 backdrop-blur-sm hover:bg-white'
                            } shadow-lg`}
                        >
                            <div className="w-6 h-6 flex flex-col justify-center relative">
                                <span className={`absolute top-1.5 h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                                    isOpen ? 'rotate-45 top-3' : ''
                                }`}></span>
                                <span className={`absolute top-3 h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                                    isOpen ? 'opacity-0' : ''
                                }`}></span>
                                <span className={`absolute top-4.5 h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                                    isOpen ? '-rotate-45 top-3' : ''
                                }`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}>
                    <div className="py-6 border-t border-gray-200/50">
                        <div className="grid grid-cols-2 gap-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 p-4 text-gray-700 hover:text-blue-600 font-medium rounded-2xl bg-gray-50/80 hover:bg-blue-50/80 transition-all duration-300 group backdrop-blur-sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                </a>
                            ))}
                        </div>
                        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200/50">
                            <a
                                href="/login"
                                className="flex-1 text-center py-3 text-gray-700 font-medium border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </a>
                            <a
                                href="/register"
                                className="flex-1 text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                onClick={() => setIsOpen(false)}
                            >
                                Register
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}