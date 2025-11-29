import TeamList from '@/components/TeamList';
import { shiftOne, shiftTwo } from '@/data/teams';

export default function Teams() {
    return (
        // Added px-5 here to ensure the ml-5 mr-5 look on mobile/desktop
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-5 mt-15">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-6 tracking-tight">
                        Competing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Teams</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Departments competing in INDEP 2025 across two shifts. <br className="hidden md:block" />
                        Find your team and get ready to cheer!
                    </p>
                </div>

                {/* Teams Grid Wrapper 
                   - Removed w-350 (which was breaking the layout)
                   - Uses grid-cols-1 on mobile, grid-cols-2 on large screens
                   - items-start prevents cards from stretching unnaturally if lists are different lengths
                */}
                {/* Teams Grid Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

                    {/* Card 1 - Green Theme (Shift I) */}
                    <div className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/5 border border-white">
                        <TeamList
                            title="Shift I"
                            teams={shiftOne}
                            color="from-green-600 to-emerald-500"
                        />
                    </div>

                    {/* Card 2 - Red Theme (Shift II) */}
                    <div className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-red-900/5 border border-white">
                        <TeamList
                            title="Shift II"
                            teams={shiftTwo}
                            color="from-red-600 to-rose-500"
                        />
                    </div>

                </div>

                {/* CTA / Info Card */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">Ready to Represent?</h3>
                        <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
                            Join your department team and be part of the biggest cultural extravaganza of the year!
                        </p>
                        <a
                            href="/register"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Register Now
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}