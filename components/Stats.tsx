export default function Stats() {
    const stats = [
        { number: '1500+', label: 'Participants', emoji: '👥' },
        { number: '2 Days', label: '12–13 Jan 2025', emoji: '📅' },
        { number: '18+', label: 'Events', emoji: '🎭' },
        { number: 'St. Joseph\'s', label: 'College Campus', emoji: '🏛️' }
    ];

    return (
        <section className="py-16 bg-white/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group hover-lift p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm"
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                                {stat.emoji}
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}