import TeamList from '@/components/TeamList';
import { shiftOne, shiftTwo } from '@/data/teams';

export default function Teams() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-800 mb-4">
                        Competing <span className="gradient-text">Teams</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Departments competing in INDEP 2025 across two shifts. Cheer for your department!
                    </p>
                </div>

                {/* Teams Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="hover-lift bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <TeamList
                            title="Shift I"
                            teams={shiftOne}
                            color="from-blue-500 to-cyan-500"
                        />
                    </div>

                    <div className="hover-lift bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <TeamList
                            title="Shift II"
                            teams={shiftTwo}
                            color="from-purple-500 to-pink-500"
                        />
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to Represent Your Department?</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Join your department team and be part of the biggest cultural extravaganza of the year!
                    </p>
                    <a
                        href="/register"
                        className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-bold text-lg hover-lift shadow-2xl"
                    >
                        Register Now
                        <span className="ml-2">→</span>
                    </a>
                </div>
            </div>
        </div>
    );
}