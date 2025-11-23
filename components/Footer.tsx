export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold">I</span>
                            </div>
                            <span className="text-xl font-black">INDEP 2025</span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md">
                            The Inter-Departmental Cultural Extravaganza at St. Joseph's College.
                            Celebrating talent, creativity, and sportsmanship across departments.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons */}
                            {['📘', '📷', '🐦', '📺'].map((icon, idx) => (
                                <div key={idx} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Events', 'Schedule', 'Teams', 'Gallery'].map((item) => (
                                <li key={item}>
                                    <a href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>St. Joseph's College</li>
                            <li>cultural@indep2025.edu</li>
                            <li>+91 98765 43210</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 INDEP - St. Joseph's College. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}