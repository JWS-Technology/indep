import React from 'react';

interface Team {
  id: string;
  name: string;
  shift: 'I' | 'II';
}

interface TeamListProps {
    title: string;
    teams: Team[];
    color?: string;
}




export default function TeamList({ title, teams, color = "from-blue-600 to-cyan-500" }: TeamListProps) {
    
    return (
        <section className="font-sans h-full">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <div className={`h-10 w-1.5 rounded-full bg-gradient-to-b ${color}`}></div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team, idx) => (
                    <div
                        key={team.id}
                        className="group relative flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Large Gradient Number */}
                        <span className={`
                            text-3xl font-black italic mr-4
                            bg-gradient-to-br ${color} bg-clip-text text-transparent
                            opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300
                            w-10 text-center flex-shrink-0
                        `}>
                            {String(idx + 1).padStart(2, '0')}
                        </span>

                        <div className="flex flex-col border-l border-gray-100 pl-4 h-full justify-center">
                            <span className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                                {team.name}
                            </span>
                        </div>

                        {/* Subtle decorative glow on hover */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
