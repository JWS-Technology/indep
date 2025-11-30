"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    MapPin,
    Clock,
    Edit2,
    Trash2,
    Plus,
    Search,
    Save,
    X,
    User,
    AlertCircle,
    CheckCircle2,
    Loader2
} from "lucide-react";

// --- Types based on your MongoDB Schema ---
type EventStatus = "scheduled" | "live" | "completed" | "cancelled" | "pending";
type StageType = "ON_STAGE" | "OFF_STAGE";

interface Incharge {
    name: string;
    department: string;
}

interface EventItem {
    _id: string; // MongoDB uses _id
    title: string;
    category: string;
    stageType: StageType;
    venue: string;
    date: string; // YYYY-MM-DD
    time: string; // Text string like "10:30 AM"
    incharge: Incharge[];
    status: EventStatus;
}

export default function AdminEventsPage() {
    // --- State ---
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | StageType>("ALL");

    // Modals & Feedback
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // --- Fetch Data ---
    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.events) {
                setEvents(data.events);
            }
        } catch (error) {
            showToast("Failed to load events", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // --- Helpers ---
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case "live": return "bg-green-100 text-green-700 border-green-200";
            case "completed": return "bg-slate-100 text-slate-500 border-slate-200";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100";
            case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            default: return "bg-blue-50 text-blue-700 border-blue-100";
        }
    };

    // --- Handlers ---
    const handleAddNew = () => {
        setEditingEvent({
            title: "",
            category: "",
            stageType: "ON_STAGE",
            venue: "",
            date: "",
            time: "",
            incharge: [{ name: "", department: "" }],
            status: "pending"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (event: EventItem) => {
        setEditingEvent({ ...event });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            const method = editingEvent._id ? 'PUT' : 'POST';
            const url = editingEvent._id ? `/api/events/${editingEvent._id}` : '/api/events';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingEvent),
            });

            if (!res.ok) throw new Error("Failed to save");

            showToast(editingEvent._id ? "Event updated" : "Event created");
            fetchEvents(); // Refresh list
            setIsModalOpen(false);
            setEditingEvent(null);
        } catch (error) {
            showToast("Error saving event", "error");
        }
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                const res = await fetch(`/api/events/${deleteId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error("Failed to delete");

                showToast("Event deleted");
                setEvents(events.filter(e => e._id !== deleteId));
            } catch (error) {
                showToast("Error deleting event", "error");
            } finally {
                setDeleteId(null);
            }
        }
    };

    // Helper to handle incharge array changes in the form
    const handleInchargeChange = (index: number, field: 'name' | 'department', value: string) => {
        if (!editingEvent || !editingEvent.incharge) return;
        const newIncharge = [...editingEvent.incharge];
        newIncharge[index] = { ...newIncharge[index], [field]: value };
        setEditingEvent({ ...editingEvent, incharge: newIncharge });
    };

    // --- Filtering ---
    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(filter.toLowerCase()) ||
            e.category.toLowerCase().includes(filter.toLowerCase());
        const matchesType = typeFilter === "ALL" || e.stageType === typeFilter;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: events.length,
        onStage: events.filter(e => e.stageType === "ON_STAGE").length,
        pending: events.filter(e => e.status === "pending").length
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 font-sans text-slate-900">

            {/* --- Toast --- */}
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-5 duration-300 border ${toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="font-medium text-sm">{toast.msg}</span>
                </div>
            )}

            {/* --- Header --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Event Manager</h1>
                    <p className="text-slate-500">Oversee schedules, venues, and in-charges.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100 flex flex-col items-center min-w-[100px]">
                        <span className="text-xs font-bold text-purple-400 uppercase">On Stage</span>
                        <span className="text-xl font-bold text-purple-700">{stats.onStage}</span>
                    </div>
                    <div className="px-4 py-2 bg-orange-50 rounded-xl border border-orange-100 flex flex-col items-center min-w-[100px]">
                        <span className="text-xs font-bold text-orange-400 uppercase">Pending</span>
                        <span className="text-xl font-bold text-orange-700">{stats.pending}</span>
                    </div>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-medium h-[62px]">
                        <Plus size={20} /> New Event
                    </button>
                </div>
            </div>

            {/* --- Toolbar --- */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent hover:bg-slate-50 focus:bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(["ALL", "ON_STAGE", "OFF_STAGE"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {type.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Events Grid --- */}
            <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map((event) => (
                    <div key={event._id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-bold shadow-sm ${event.stageType === 'ON_STAGE' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {event.title.charAt(0)}
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{event.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{event.category}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getStatusColor(event.status)}`}>{event.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(event)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                        <button onClick={() => setDeleteId(event._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span>{event.date || 'TBA'}</span></div>
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span>{event.time || 'TBA'}</span></div>
                                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span className="truncate">{event.venue || 'No Venue'}</span></div>
                                    <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="truncate">{event.incharge?.[0]?.name || 'No In-charge'}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Edit Modal --- */}
            {isModalOpen && editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900">{editingEvent._id ? "Edit Event" : "New Event"}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="eventForm" onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                            <input required type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                            <input required type="text" value={editingEvent.category} onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Stage Type</label>
                                            <select value={editingEvent.stageType} onChange={(e) => setEditingEvent({ ...editingEvent, stageType: e.target.value as StageType })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white">
                                                <option value="ON_STAGE">On Stage</option>
                                                <option value="OFF_STAGE">Off Stage</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logistics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date (YYYY-MM-DD)</label>
                                            <input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                            <input type="text" value={editingEvent.time} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" placeholder="e.g. 10:30 AM" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                                            <input type="text" value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Primary In-Charge Name</label>
                                            <input type="text" value={editingEvent.incharge?.[0]?.name || ''} onChange={(e) => handleInchargeChange(0, 'name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500" placeholder="Faculty Name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                            <select value={editingEvent.status} onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white">
                                                <option value="pending">Pending</option>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="live">Live Now</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">Cancel</button>
                            <button type="submit" form="eventForm" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2"><Save size={18} /> Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Delete Confirm --- */}
            {deleteId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Event?</h3>
                        <p className="text-slate-500 mb-6">Action cannot be undone.</p>
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