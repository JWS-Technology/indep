export default function Hero() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center gradient-bg text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-xl"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                <div className="inline-block mb-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    🎉 12–13 January 2025
                </div>

                <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                    INDEP <span className="text-yellow-300">2025</span>
                </h1>

                <p className="text-xl md:text-2xl mb-8 font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
                    The Inter-Departmental Cultural Extravaganza at St. Joseph's College
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <a
                        href="/register"
                        className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover-lift shadow-2xl flex items-center gap-2"
                    >
                        <span>Register Your Team</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    <a
                        href="/schedule"
                        className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover-lift backdrop-blur-sm flex items-center gap-2"
                    >
                        <span>View Schedule</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}