export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                    <span className="text-white font-bold text-lg">I</span>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                            </div>
                            <div>
                                <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    INDEP 2025
                                </span>
                                <p className="text-sm text-gray-400">St. Joseph's College</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-xl">
                            The Inter-Departmental Cultural Extravaganza at St. Joseph's College. 
                            Celebrating talent, creativity, and sportsmanship across departments 
                            through a spectacular showcase of cultural excellence.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { icon: '📘', label: 'Facebook' },
                                { icon: '📷', label: 'Instagram' },
                                { icon: '🐦', label: 'Twitter' },
                                { icon: '📺', label: 'YouTube' }
                            ].map((social, idx) => (
                                <button
                                    key={idx}
                                    className="group relative p-3 bg-gray-800 rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                    aria-label={social.label}
                                >
                                    <span className="text-lg">{social.icon}</span>
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {social.label}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-xl mb-6 relative inline-block">
                            Quick Links
                            <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Events', emoji: '🎭' },
                                { name: 'Schedule', emoji: '📅' },
                                { name: 'Teams', emoji: '👥' },
                                { name: 'Gallery', emoji: '🖼️' },
                                { name: 'Results', emoji: '🏆' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a 
                                        href={`/${item.name.toLowerCase()}`}
                                        className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                                    >
                                        <span className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {item.emoji}
                                        </span>
                                        <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                                            {item.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-xl mb-6 relative inline-block">
                            Get In Touch
                            <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 mt-1">
                                    <span className="text-blue-400">🏫</span>
                                </div>
                                <div>
                                    <p className="text-gray-300 font-medium">St. Joseph's College</p>
                                    <p className="text-gray-400 text-sm">Tiruchirappalli, Tamil Nadu</p>
                                </div>
                            </li>
                            <li className="flex items-center">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-green-400">📧</span>
                                </div>
                                <a 
                                    href="mailto:cultural@indep2025.edu" 
                                    className="text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    cultural@indep2025.edu
                                </a>
                            </li>
                            <li className="flex items-center">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-red-400">📞</span>
                                </div>
                                <a 
                                    href="tel:+919876543210" 
                                    className="text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    +91 98765 43210
                                </a>
                            </li>
                        </ul>
                       
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-800 mb-8">
                    {[
                        { number: '50+', label: 'Events' },
                        { number: '15+', label: 'Departments' },
                        { number: '1000+', label: 'Participants' },
                        { number: '3', label: 'Days' }
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {stat.number}
                            </div>
                            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-gray-400 text-sm">
                        <p>&copy; 2025 INDEP - St. Joseph's College. All rights reserved.</p>
                    </div>
                    
                    <div className="flex space-x-6 text-sm">
                        {['Privacy Policy', 'Terms of Service', 'Code of Conduct'].map((item) => (
                            <a 
                                key={item}
                                href={`/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Gradient Line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        </footer>
    );
}