"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    UserCog,
    IdCard,
    Key,
    Check,
    CheckSquare,
    Square,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff
} from "lucide-react";

// --- Types ---
interface Coordinator {
    _id: string;
    name: string;
    dNo: string;
    password: string;
    assignedEvents: string[]; // Stores event titles
    createdAt?: string;
}

// Basic shape of the Event object coming from your API
interface EventItem {
    _id: string;
    title: string;
}

export default function AdminCoordinatorsPage() {
    // --- State ---
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [availableEvents, setAvailableEvents] = useState<string[]>([]); // Dynamic events list
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");

    // Modals & Feedback
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoordinator, setEditingCoordinator] = useState<Partial<Coordinator> | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // UI Helpers
    const [showPassword, setShowPassword] = useState(false);

    // --- Fetch Data ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Coordinators
            const coordsRes = await fetch('/api/admin/coordinators');
            const coordsData = await coordsRes.json();

            // 2. Fetch Events (from your provided backend)
            const eventsRes = await fetch('/api/events');
            const eventsData = await eventsRes.json();

            if (coordsData.coordinators) {
                setCoordinators(coordsData.coordinators);
            }

            if (eventsData.events) {
                // Extract just the titles to match your current string[] schema for assignedEvents
                const eventTitles = eventsData.events.map((e: EventItem) => e.title);
                setAvailableEvents(eventTitles);
            }

        } catch (error) {
            showToast("Failed to load data", "error");
            console.error(error);
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
        setEditingCoordinator({
            name: "",
            dNo: "",
            password: "",
            assignedEvents: []
        });
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleEdit = (coord: Coordinator) => {
        setEditingCoordinator({ ...coord });
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const toggleEventSelection = (eventName: string) => {
        if (!editingCoordinator) return;
        const currentEvents = editingCoordinator.assignedEvents || [];

        const updatedEvents = currentEvents.includes(eventName)
            ? currentEvents.filter(e => e !== eventName) // Remove
            : [...currentEvents, eventName]; // Add

        setEditingCoordinator({ ...editingCoordinator, assignedEvents: updatedEvents });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCoordinator) return;

        try {
            const method = editingCoordinator._id ? 'PUT' : 'POST';
            const url = editingCoordinator._id
                ? `/api/admin/coordinators/${editingCoordinator._id}`
                : '/api/admin/create-coordinator';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCoordinator),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save");

            showToast(editingCoordinator._id ? "Coordinator updated" : "Coordinator created");
            fetchData(); // Refresh data to get updates
            setIsModalOpen(false);
            setEditingCoordinator(null);
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                const res = await fetch(`/api/admin/coordinators/${deleteId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error("Failed to delete");

                showToast("Coordinator removed");
                setCoordinators(coordinators.filter(c => c._id !== deleteId));
            } catch (error) {
                showToast("Error deleting coordinator", "error");
            } finally {
                setDeleteId(null);
            }
        }
    };

    // --- Filtering ---
    const filteredList = coordinators.filter(c =>
        c.name.toLowerCase().includes(filter.toLowerCase()) ||
        c.dNo.toLowerCase().includes(filter.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 font-sans text-slate-900">

            {/* --- Toast --- */}
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-5 duration-300 border ${toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="font-medium text-sm">{toast.msg}</span>
                </div>
            )}

            {/* --- Header --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Coordinator Manager</h1>
                    <p className="text-slate-500">Manage coordinator accounts, credentials, and event assignments.</p>
                </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium">
                    <Plus size={20} /> Add Coordinator
                </button>
            </div>

            {/* --- Toolbar --- */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or department ID..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent hover:bg-slate-50 focus:bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* --- Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredList.map((coord) => (
                    <div key={coord._id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
                                        {coord.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{coord.name}</h3>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                                            <IdCard size={14} />
                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700">{coord.dNo}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(coord)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => setDeleteId(coord._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Events</p>
                                <div className="flex flex-wrap gap-2">
                                    {coord.assignedEvents.length > 0 ? (
                                        coord.assignedEvents.map((event, idx) => (
                                            <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {event}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No events assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Edit Modal --- */}
            {isModalOpen && editingCoordinator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserCog className="w-5 h-5 text-indigo-600" />
                                {editingCoordinator._id ? "Edit Coordinator" : "New Coordinator"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="coordForm" onSubmit={handleSave} className="space-y-6">
                                {/* Credentials Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Credentials</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                            <input required type="text" value={editingCoordinator.name} onChange={(e) => setEditingCoordinator({ ...editingCoordinator, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Department No. (dNo)</label>
                                            <div className="relative">
                                                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required type="text" value={editingCoordinator.dNo} onChange={(e) => setEditingCoordinator({ ...editingCoordinator, dNo: e.target.value.toUpperCase() })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. CS_01" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required type={showPassword ? "text" : "password"} value={editingCoordinator.password} onChange={(e) => setEditingCoordinator({ ...editingCoordinator, password: e.target.value })} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 transition-colors" placeholder="Set password" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Assignment Section */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Assignments</h3>
                                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{editingCoordinator.assignedEvents?.length || 0} Selected</span>
                                    </div>

                                    {availableEvents.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-sm">No events found in the system.</p>
                                            <p className="text-xs mt-1">Please add events in the Event Manager first.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                            {availableEvents.map(eventTitle => {
                                                const isSelected = editingCoordinator.assignedEvents?.includes(eventTitle);
                                                return (
                                                    <div
                                                        key={eventTitle}
                                                        onClick={() => toggleEventSelection(eventTitle)}
                                                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between group ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}
                                                    >
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{eventTitle}</span>
                                                        {isSelected
                                                            ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                                                            : <Square className="w-5 h-5 text-slate-300 group-hover:text-indigo-300" />
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                            <button type="submit" form="coordForm" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Delete Confirm --- */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Coordinator?</h3>
                        <p className="text-slate-500 mb-6">This will permanently remove the account and unassign them from events.</p>
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