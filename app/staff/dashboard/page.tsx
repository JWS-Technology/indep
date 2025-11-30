"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  department: string;
  event: string;
  lotNumber: string;
  dNumber: string;
  createdAt: string;
}

export default function StaffDashboard() {
  const [recentTeams, setRecentTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState({
    totalTeams: 12,
    activeEvents: 5,
    departments: 8,
  });

  useEffect(() => {
    // Mock data
    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Focus Team",
        department: "Computer Science",
        event: "Quiz Competition",
        lotNumber: "LOT-001",
        dNumber: "D-2024-001",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Menu Tanner",
        department: "Electronics",
        event: "Code Wars",
        lotNumber: "LOT-002",
        dNumber: "D-2024-002",
        createdAt: "2024-01-14",
      },
      
    ];

    setRecentTeams(mockTeams);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 w-full">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-3 md:mb-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Welcome to INDEP 2025</h1>
              <p className="text-blue-100 opacity-90 text-sm md:text-base">
                Manage teams and events for the Cultural Festival
              </p>
            </div>
            <div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2">
                <p className="text-xs md:text-sm font-medium">Staff User</p>
                <p className="text-xs opacity-80">Microsoft Teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total Teams</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{stats.totalTeams}</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <span className="text-lg md:text-xl text-blue-600">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Active Events</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{stats.activeEvents}</p>
              </div>
              <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                <span className="text-lg md:text-xl text-green-600">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Departments</p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{stats.departments}</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-100 rounded-lg">
                <span className="text-lg md:text-xl text-purple-600">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link
              href="/staff/team/create"
              className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <span className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">➕</span>
              <span className="font-medium text-gray-700 group-hover:text-blue-600 text-xs md:text-sm text-center">Create Team</span>
            </Link>
            
            <button className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
              <span className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">📋</span>
              <span className="font-medium text-gray-700 group-hover:text-green-600 text-xs md:text-sm text-center">View Teams</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
              <span className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">📊</span>
              <span className="font-medium text-gray-700 group-hover:text-purple-600 text-xs md:text-sm text-center">Reports</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-3 md:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
              <span className="text-xl md:text-2xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">⚙️</span>
              <span className="font-medium text-gray-700 group-hover:text-orange-600 text-xs md:text-sm text-center">Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Teams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Teams</h2>
            <Link
              href="/staff/team/create"
              className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs md:text-sm w-full sm:w-auto text-center"
            >
              Create New Team
            </Link>
          </div>

          <div className="overflow-x-auto">
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3">
              {recentTeams.map((team) => (
                <div key={team.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{team.name}</h3>
                        <p className="text-xs text-gray-500">{team.department}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {team.event}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Lot:</span>
                        <span className="font-mono ml-1 text-gray-700">{team.lotNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">D.No:</span>
                        <span className="font-mono ml-1 text-gray-700">{team.dNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden md:table w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Number</th>
                  <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D. Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{team.department}</div>
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{team.event}</div>
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{team.lotNumber}</div>
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{team.dNumber}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentTeams.length === 0 && (
            <div className="text-center py-6 md:py-8">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 text-gray-300">👥</div>
              <p className="text-gray-500 text-sm md:text-base">No teams created yet.</p>
              <Link
                href="/staff/team/create"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm"
              >
                Create your first team
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}