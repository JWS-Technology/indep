'use client';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Events', href: '/events' },
        { name: 'Teams', href: '/teams' },
        { name: 'Schedule', href: '/schedule' },
        { name: 'Gallery', href: '/gallery' },
        // { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">I</span>
                            </div>
                            <span className="text-xl font-black gradient-text">INDEP 2025</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a
                            href="/login"
                            className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover-lift shadow-lg"
                        >
                            Register
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block h-0.5 w-6 bg-gray-700 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <a
                                    href="/login"
                                    className="block text-center py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="block text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover-lift shadow-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}