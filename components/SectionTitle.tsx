export default function SectionTitle() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl w-full">
                {/* Header Section - Centered */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center space-x-3 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-medium">
                            Inter Departmental Cultural Events
                        </p>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-gray-800 bg-clip-text text-transparent mb-6">
                        Welcome to INDEP 2025
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Alternating Cards Layout */}
                <div className="space-y-12">
                    {/* First Card - Left Aligned */}
                    <div className="flex justify-start">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative">
                            <div className="absolute -left-4 top-8 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">1</span>
                            </div>
                            <div className="flex items-start space-x-6">
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
                                    <span className="text-blue-600 text-2xl">🎯</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xl text-gray-700 leading-relaxed text-left">
                                        <span className="font-bold text-gray-900 text-2xl block mb-4">
                                            Cherished Memories for Every Josephite
                                        </span>
                                        INDEP is an event which is ever cherishing and memorable in his/her life. 
                                        Expanded as Inter Departmental Cultural Events, it's a cultural extravaganza 
                                        where more than <span className="text-blue-600 font-bold">1500 students</span> take part 
                                        in various cultural or literary events.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Card - Right Aligned */}
                    <div className="flex justify-end">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative">
                            <div className="absolute -right-4 top-8 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">2</span>
                            </div>
                            <div className="flex items-start space-x-6">
                                <div className="flex-1">
                                    <p className="text-xl text-gray-700 leading-relaxed text-left">
                                        <span className="font-bold text-gray-900 text-2xl block mb-4">
                                            Student-Led Excellence
                                        </span>
                                        Organized by the students under the able guidance of Professors. INDEP enables 
                                        the students to develop their <span className="text-purple-600 font-bold">extra curricular skills</span>, 
                                        <span className="text-indigo-600 font-bold"> leadership qualities</span>, and 
                                        <span className="text-blue-600 font-bold"> organising skills</span> through hands-on experience.
                                    </p>
                                </div>
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center border border-purple-200">
                                    <span className="text-purple-600 text-2xl">🌟</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Third Card - Center Aligned with Full Width */}
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-200 p-10 max-w-4xl w-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl">⚡</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                                    Healthy Competition Across Shifts
                                </h3>
                                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                                    INDEP is conducted among the Departments both{' '}
                                    <span className="text-blue-600 font-bold bg-white px-4 py-2 rounded-full shadow-md mx-2">Shift I</span> and{' '}
                                    <span className="text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-md mx-2">Shift II</span>{' '}
                                    to bring out the spirit of healthy competition and sportsmanship.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
}