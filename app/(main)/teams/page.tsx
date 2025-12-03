'use client';

import { useEffect, useState } from 'react';
import TeamList from '@/components/teams/TeamList';

// Import static team data
import { shiftOne, shiftTwo } from '@/data/teams';

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

  useEffect(() => {
    // Convert shiftOne string array → Team objects
    const shiftOneTeams: Team[] = shiftOne.map((name, idx) => ({
      id: `shift1-${idx}`,
      name,
      shift: 'I'
    }));

    // Convert shiftTwo string array → Team objects
    const shiftTwoTeams: Team[] = shiftTwo.map((name, idx) => ({
      id: `shift2-${idx}`,
      name,
      shift: 'II'
    }));

    setTeams({
      shiftOne: shiftOneTeams,
      shiftTwo: shiftTwoTeams
    });

  }, []);

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
