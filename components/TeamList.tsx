interface TeamListProps {
    title: string;
    teams: string[];
    color?: string;
}

export default function TeamList({ title, teams, color = "from-blue-500 to-cyan-500" }: TeamListProps) {
    return (
        <section className="mb-10">
            <div className="flex items-center mb-6">
                <div className={`w-3 h-8 bg-linear-to-b ${color} rounded-full mr-3`}></div>
                <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teams.map((team, idx) => (
                    <div
                        key={idx}
                        className="group flex items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover-lift border border-gray-200 hover:border-blue-200 transition-all duration-300"
                    >
                        <div className={`w-2 h-2 bg-linear-to-r ${color} rounded-full mr-3 group-hover:scale-150 transition-transform`}></div>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900">{team}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}