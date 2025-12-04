"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Users,
    Key,
    Briefcase,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Clock,
    UserCheck,
    Settings,
    ToggleLeft,
    ToggleRight
} from "lucide-react";

// --- Types ---
interface Team {
    _id: string;
    teamId: string;
    teamName: string;
    shift: string;
    password?: string;
    isPasswordChanged: boolean;
    membersCreated: {
        faculty: boolean;
        student: boolean;
    };
}

export default function AdminTeamsPage() {
    // --- State ---
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");

    // Modals & Feedback
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Partial<Team> | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    // UI Helpers
    const [showPassword, setShowPassword] = useState(false);

    // --- Fetch Data ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/teams');
            const data = await res.json();
            if (data.teams) setTeams(data.teams);
        } catch (error) {
            showToast("Failed to load teams", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Helpers ---
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- Handlers ---
    const handleAddNew = () => {
        setEditingTeam({
            teamId: "",
            teamName: "",
            shift: "Shift I",
            password: "",
            isPasswordChanged: false,
            membersCreated: { faculty: false, student: false }
        });
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleEdit = (team: Team) => {
        setEditingTeam({ ...team, password: "" }); // keep existing password unless typed
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeam) return;

        try {
            const method = editingTeam._id ? 'PUT' : 'POST';
            const url = editingTeam._id
                ? `/api/admin/teams/${editingTeam._id}`
                : '/api/admin/create-team';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTeam),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save");

            showToast(editingTeam._id ? "Team updated" : "Team created");
            fetchData();
            setIsModalOpen(false);
            setEditingTeam(null);
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                const res = await fetch(`/api/admin/teams/${deleteId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error("Failed to delete");
                showToast("Team removed");
                setTeams(teams.filter(t => t._id !== deleteId));
            } catch (error) {
                showToast("Error deleting team", "error");
            } finally {
                setDeleteId(null);
            }
        }
    };

    // --- Filtering ---
    const filteredList = teams.filter(t =>
        t.teamName.toLowerCase().includes(filter.toLowerCase()) ||
        t.teamId.toLowerCase().includes(filter.toLowerCase())
    );

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 font-sans text-slate-900">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-5 duration-300 border ${toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="font-medium text-sm">{toast.msg}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Team Manager</h1>
                    <p className="text-slate-500">Create departments, manage shifts, and update system flags.</p>
                </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium">
                    <Plus size={20} /> Add Team
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Team Name or ID..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent hover:bg-slate-50 focus:bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredList.map((team) => (
                    <div key={team._id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{team.teamName}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs text-slate-600 font-semibold">{team.teamId}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${team.shift === 'Shift I' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                <Clock size={10} /> {team.shift}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(team)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => setDeleteId(team._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-2 gap-2">
                                <div className={`flex items-center gap-2 p-2 rounded-lg border ${team.membersCreated?.faculty ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <UserCheck size={16} /> <span className="text-xs font-medium">Faculty</span>
                                </div>
                                <div className={`flex items-center gap-2 p-2 rounded-lg border ${team.membersCreated?.student ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <UserCheck size={16} /> <span className="text-xs font-medium">Student</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" /> {editingTeam._id ? "Edit Team" : "Create Team"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="teamForm" onSubmit={handleSave} className="space-y-6">

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Team ID</label>
                                        <input required type="text" value={editingTeam.teamId} onChange={(e) => setEditingTeam({ ...editingTeam, teamId: e.target.value.toUpperCase() })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 uppercase font-mono" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Team Name</label>
                                        <input required type="text" value={editingTeam.teamName} onChange={(e) => setEditingTeam({ ...editingTeam, teamName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500" />
                                    </div>
                                </div>

                                {/* Shift */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Shift</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Shift I', 'Shift II'].map((shift) => (
                                            <div key={shift} onClick={() => setEditingTeam({ ...editingTeam, shift: shift })} className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all ${editingTeam.shift === shift ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'hover:bg-slate-50 border-slate-200'}`}>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editingTeam.shift === shift ? 'border-indigo-600' : 'border-slate-300'}`}>
                                                    {editingTeam.shift === shift && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                                                </div>
                                                <span className="text-sm font-medium">{shift}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type={showPassword ? "text" : "password"} value={editingTeam.password || ""} onChange={(e) => setEditingTeam({ ...editingTeam, password: e.target.value })} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500" placeholder="Set password" required={!editingTeam._id} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* System Overrides (New Section) */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <Settings size={12} /> System Overrides (Advanced)
                                    </h4>

                                    <div className="space-y-3">
                                        {/* Toggle Faculty Created */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm text-slate-600">Members Created: Faculty</label>
                                            <button
                                                type="button"
                                                onClick={() => setEditingTeam({
                                                    ...editingTeam,
                                                    membersCreated: { ...editingTeam.membersCreated!, faculty: !editingTeam.membersCreated?.faculty }
                                                })}
                                                className={`${editingTeam.membersCreated?.faculty ? 'text-emerald-600' : 'text-slate-300'} transition-colors`}
                                            >
                                                {editingTeam.membersCreated?.faculty ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                            </button>
                                        </div>

                                        {/* Toggle Student Created */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm text-slate-600">Members Created: Student</label>
                                            <button
                                                type="button"
                                                onClick={() => setEditingTeam({
                                                    ...editingTeam,
                                                    membersCreated: { ...editingTeam.membersCreated!, student: !editingTeam.membersCreated?.student }
                                                })}
                                                className={`${editingTeam.membersCreated?.student ? 'text-emerald-600' : 'text-slate-300'} transition-colors`}
                                            >
                                                {editingTeam.membersCreated?.student ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                            </button>
                                        </div>

                                        {/* Toggle Password Changed */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm text-slate-600">Is Password Changed?</label>
                                            <button
                                                type="button"
                                                onClick={() => setEditingTeam({
                                                    ...editingTeam,
                                                    isPasswordChanged: !editingTeam.isPasswordChanged
                                                })}
                                                className={`${editingTeam.isPasswordChanged ? 'text-emerald-600' : 'text-slate-300'} transition-colors`}
                                            >
                                                {editingTeam.isPasswordChanged ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                            <button type="submit" form="teamForm" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                                <Save size={18} /> Save Team
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal (Same as previous) */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Team?</h3>
                        <p className="text-slate-500 mb-6 text-sm">This will permanently remove the team.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}