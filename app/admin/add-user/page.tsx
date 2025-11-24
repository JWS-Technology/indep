"use client";

import { useState } from "react";
import { shiftOne, shiftTwo } from "@/data/teams";

export default function AddUserPage() {
    const [form, setForm] = useState({
        name: "",
        collegeId: "",
        password: "",
        role: "student",
        department: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeStep, setActiveStep] = useState(1);
    const [isDeptOpen, setIsDeptOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/admin/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("success");
            setForm({
                name: "",
                collegeId: "",
                password: "",
                role: "student",
                department: "",
            });
            setActiveStep(1);
        } else {
            setMessage("error");
        }
        setLoading(false);
    };

    const selectDepartment = (dept: string) => {
        setForm({ ...form, department: dept });
        setIsDeptOpen(false);
    };

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Create New User
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Add students, faculty, or administrators to the system
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Steps - Left Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="space-y-8">
                                {[
                                    { number: 1, title: "Personal Info", desc: "Basic details" },
                                    { number: 2, title: "Account Type", desc: "Role & Department" },
                                    { number: 3, title: "Review & Create", desc: "Final details" }
                                ].map((step) => (
                                    <div key={step.number} className="flex items-center space-x-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                            activeStep >= step.number 
                                                ? "bg-purple-600 border-purple-500" 
                                                : "bg-white/10 border-white/30"
                                        }`}>
                                            <span className={`font-bold ${
                                                activeStep >= step.number ? "text-white" : "text-white/60"
                                            }`}>
                                                {step.number}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${
                                                activeStep >= step.number ? "text-white" : "text-white/60"
                                            }`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-white/40 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Content - Right Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step 1: Personal Info */}
                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name Card */}
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white font-semibold">Full Name</h3>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            {/* College ID Card */}
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white font-semibold">College ID</h3>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Example: 23UBC506"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                                    value={form.collegeId}
                                                    onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Password Card */}
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-white font-semibold">Password</h3>
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Enter secure password"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Role & Department */}
                                {activeStep === 2 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Role Selection */}
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white font-semibold">Role</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {["student", "faculty", "admin"].map((role) => (
                                                        <label key={role} className="flex items-center space-x-3 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="role"
                                                                value={role}
                                                                checked={form.role === role}
                                                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                                className="hidden"
                                                            />
                                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                                form.role === role ? "border-orange-500" : "border-white/30"
                                                            }`}>
                                                                {form.role === role && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                                                            </div>
                                                            <span className="text-white capitalize">{role}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Department Selection */}
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white font-semibold">Department</h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-pink-500/50 transition-all duration-300"
                                                >
                                                    <span className={form.department ? "text-white" : "text-white/40"}>
                                                        {form.department || "Select Department"}
                                                    </span>
                                                    <svg className={`w-5 h-5 text-white/60 transition-transform duration-200 ${isDeptOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {isDeptOpen && (
                                                    <div className="mt-3 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                                        <div className="max-h-48 overflow-y-auto">
                                                            <div className="p-3 border-b border-white/10">
                                                                <h4 className="text-purple-300 text-sm font-semibold mb-2">Shift I</h4>
                                                                <div className="space-y-1">
                                                                    {shiftOne.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-white text-sm rounded hover:bg-white/10 transition-colors duration-200"
                                                                        >
                                                                            {dept}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="p-3">
                                                                <h4 className="text-blue-300 text-sm font-semibold mb-2">Shift II</h4>
                                                                <div className="space-y-1">
                                                                    {shiftTwo.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-white text-sm rounded hover:bg-white/10 transition-colors duration-200"
                                                                        >
                                                                            {dept}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {activeStep === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                            <h3 className="text-white font-semibold text-lg mb-4">Review Details</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60">Full Name:</span>
                                                    <span className="text-white font-medium">{form.name || "Not provided"}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60">College ID:</span>
                                                    <span className="text-white font-medium">{form.collegeId || "Not provided"}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                    <span className="text-white/60">Role:</span>
                                                    <span className="text-white font-medium capitalize">{form.role}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-white/60">Department:</span>
                                                    <span className="text-white font-medium">{form.department || "Not selected"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-6">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={activeStep === 1}
                                        className="px-6 py-3 border border-white/20 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300"
                                    >
                                        Back
                                    </button>

                                    {activeStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-semibold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Creating...</span>
                                                </div>
                                            ) : (
                                                "Create User"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Success/Error Message */}
                            {message && (
                                <div className={`mt-6 p-4 rounded-lg border ${
                                    message === "success" 
                                        ? "bg-green-500/20 border-green-500/50 text-green-300" 
                                        : "bg-red-500/20 border-red-500/50 text-red-300"
                                }`}>
                                    {message === "success" 
                                        ? "✅ User created successfully!" 
                                        : "❌ Something went wrong. Please try again."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}