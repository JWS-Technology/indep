import VisitorCounter from "@/components/VisitorCounter";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MapPin,
    Mail,
    Phone,
} from "lucide-react";
import Image from "next/image";
export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            {/* Main Footer */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="relative group">
                                <div className="relative w-10 h-10 overflow-hidden ">
                                    <Image
                                        src={"/logo.png"}
                                        alt="INDEP Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {/* <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" /> */}
                            </div>

                            <div>
                                <h2 className="font-black ml-2 text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300">
                                    INDEP '25
                                </h2>

                            </div>
                        </div>

                        <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-6 max-w-2xl">
                            The Inter-Departmental Cultural Extravaganza at St. Joseph's College.
                            Celebrating talent, creativity, and sportsmanship across departments
                            through a spectacular showcase of cultural excellence.
                        </p>

                        {/* Social Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <Facebook size={18} />, label: "Facebook", color: "hover:from-blue-500 hover:to-blue-600" },
                                { icon: <Instagram size={18} />, label: "Instagram", color: "hover:from-pink-500 hover:to-purple-600" },
                                { icon: <Twitter size={18} />, label: "Twitter", color: "hover:from-sky-500 hover:to-sky-600" },
                                { icon: <Youtube size={18} />, label: "YouTube", color: "hover:from-red-500 hover:to-red-600" },
                            ].map((social, idx) => (
                                <button
                                    key={idx}
                                    className={`group relative p-3 bg-gray-800 rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                                >
                                    <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">
                                        {social.icon}
                                    </span>

                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-700">
                                            {social.label}
                                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-gray-700" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg lg:text-xl mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                        </h3>

                        <ul className="space-y-3">
                            {[
                                { name: "Events", href: "/events" },
                                { name: "Schedule", href: "/schedule" },
                                { name: "Teams", href: "/teams" },
                                { name: "Gallery", href: "/gallery" },
                                { name: "Results", href: "/results" },
                                { name: "Contact", href: "/contact" },
                                { name: "Rules & Regulations", href: "/rules" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 py-2"
                                    >
                                        <span className="mr-3 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                                            ➜
                                        </span>
                                        <span className="border-b border-transparent group-hover:border-white transition-all duration-300 text-sm lg:text-base">
                                            {item.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg lg:text-xl mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                        </h3>

                        <ul className="space-y-4">

                            <li className="flex items-start group">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 mt-1 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-300 font-medium text-sm lg:text-base">
                                        St. Joseph's College
                                    </p>
                                    <p className="text-gray-400 text-xs lg:text-sm">
                                        Tiruchirappalli, Tamil Nadu
                                    </p>
                                </div>
                            </li>

                            <li className="flex items-center group">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <Mail size={18} className="text-green-400" />
                                </div>
                                <a
                                    href="mailto:indep@sjctni.edu"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base break-all"
                                >
                                    indep@sjctni.edu
                                </a>
                            </li>

                            <li className="flex items-center group">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <Phone size={18} className="text-red-400" />
                                </div>
                                <a
                                    href="tel:+919876543210"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm lg:text-base"
                                >
                                    +91 98765 43210
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 pt-6 border-t border-gray-800">
                    <div className="text-gray-400 text-sm text-center lg:text-left">
                        <p>&copy; 2025 INDEP - St. Joseph's College. All rights reserved.</p>
                        <a href="https://www.jwstechnologies.com" target='_blank' className="text-xs text-gray-500 mt-1">
                            Powered by JWS Technologies
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 lg:gap-6 text-sm">
                        {["Privacy Policy", "Terms of Service", "Code of Conduct"].map((item) => (
                            <a
                                key={item}
                                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                                className="text-gray-400 hover:text-white transition-colors duration-300 text-xs lg:text-sm hover:underline"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            {/* Visitor Counter */}
            <VisitorCounter />

            {/* Decorative Gradient Line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>

        </footer>
    );
}
