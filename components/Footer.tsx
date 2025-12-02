import VisitorCounter from "@/components/VisitorCounter";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MapPin,
    Mail,
    Phone,
    MessageCircle // fallback for chat icon
} from "lucide-react";
import Image from "next/image";

// Custom WhatsApp SVG for brand accuracy
const WhatsAppIcon = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);

export default function Footer() {
    const whatsAppGroupLink = "https://chat.whatsapp.com/Cl7CGlUGIFiHwElOdG2ajg?mode=hqrt3";

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
                                { icon: <Facebook size={18} />, label: "Facebook", color: "hover:from-blue-500 hover:to-blue-600", href: "#" },
                                { icon: <Instagram size={18} />, label: "Instagram", color: "hover:from-pink-500 hover:to-purple-600", href: "#" },
                                { icon: <Twitter size={18} />, label: "Twitter", color: "hover:from-sky-500 hover:to-sky-600", href: "#" },
                                { icon: <Youtube size={18} />, label: "YouTube", color: "hover:from-red-500 hover:to-red-600", href: "#" },
                                // Added WhatsApp to the main list as well
                                { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", color: "hover:from-green-500 hover:to-green-600", href: whatsAppGroupLink },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target={social.href.startsWith("http") ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`group relative p-3 bg-gray-800 rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`}
                                >
                                    <span className="text-lg transform group-hover:scale-110 transition-transform duration-300 block">
                                        {social.icon}
                                    </span>

                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                                        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-700 shadow-lg">
                                            {social.label}
                                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-gray-700" />
                                        </div>
                                    </div>
                                </a>
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
                                // { name: "Results", href: "/results" },
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
                        <a href="https://www.jwstechnologies.com" target='_blank' className="text-xl text-white mt-1 hover:text-gray-300 transition-colors">
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

            {/* --- NEW WHATSAPP GROUP CTA --- */}
            {/* Placed immediately above the Visitor Counter as requested */}
            <div className="fixed bottom-6 left-6 z-50 group">
                <a
                    href={whatsAppGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:bg-green-600 hover:scale-110 transition-all duration-300"
                    aria-label="Join WhatsApp Group"
                >
                    {/* Ping Animation Effect */}
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

                    {/* Icon */}
                    <WhatsAppIcon className="text-white relative z-10" size={32} />

                    {/* Notification Badge (Red Dot) */}
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center border-2 border-green-500">1</span>
                    </span>

                    {/* Tooltip (Slides out on hover) */}
                    <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden md:block">
                        Join Community
                        {/* Triangle arrow for tooltip */}
                        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></span>
                    </span>
                </a>
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