'use client';

import { useEffect, useState } from 'react';
import TeamList from '@/components/teams/TeamList';

interface Team {
  id: string;
  name: string;
  shift: 'I' | 'II';
}

export default function Teams() {
    const [teams, setTeams] = useState<{ shiftOne: Team[]; shiftTwo: Team[] }>({
        shiftOne: [],
        shiftTwo: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchTeams = async () => {
        try {
            const res = await fetch('/api/team');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            console.log('Raw API response:', data);

            if (!Array.isArray(data.teams)) throw new Error('Unexpected API response');

            // Map API objects to our Team interface
            const mappedTeams: Team[] = data.teams.map((team: any) => ({
                id: team.teamId,
                name: team.teamName,
                shift: team.shift === 'Shift I' ? 'I' : 'II',
            }));

            // Filter by shift
            const shiftOne = mappedTeams.filter(team => team.shift === 'I');
            const shiftTwo = mappedTeams.filter(team => team.shift === 'II');

            console.log('Shift I teams:', shiftOne);
            console.log('Shift II teams:', shiftTwo);

            setTeams({ shiftOne, shiftTwo });

        } catch (err: any) {
            console.error('Failed to fetch teams:', err);
            setError(err.message || 'Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    fetchTeams();
}, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Loading teams...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-5 mt-20">
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

                {/* Teams Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                    <div className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/5 border border-white">
                        <TeamList
                            title="Shift I"
                            teams={teams.shiftOne}
                            color="from-green-600 to-emerald-500"
                        />
                    </div>
                    <div className="hover-lift bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl shadow-red-900/5 border border-white">
                        <TeamList
                            title="Shift II"
                            teams={teams.shiftTwo}
                            color="from-red-600 to-rose-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
