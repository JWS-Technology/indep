"use client";



export default function Hero() {

    return (
        <section
            className="relative min-h-[100vh] flex items-center justify-center text-white overflow-hidden"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Floating blur shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-xl"></div>

            {/* Compact Counter - Top Right Corner */}


            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                {/* Date pill */}
                <div className="inline-block mt-20 mb-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    🎉 12–13 December 2025
                </div>

                {/* Title */}
                <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                    INDEP <span className="text-yellow-300">2025</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl mb-8 font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
                    The Inter-Departmental Cultural Extravaganza at <br />
                    St. Joseph&apos;s College
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <a
                        href="/register"
                        className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover-lift shadow-2xl flex items-center gap-2 transition-all duration-300 hover:shadow-3xl hover:scale-105"
                    >
                        <span>Register Your Team</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    <a
                        href="/schedule"
                        className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover-lift backdrop-blur-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                        <span>View Schedule</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}