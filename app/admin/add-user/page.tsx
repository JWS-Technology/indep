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
    const [touched, setTouched] = useState({
        name: false,
        collegeId: false,
        password: false,
        department: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        if (!form.name || !form.collegeId || !form.password || !form.department) {
            setMessage("error");
            return;
        }

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
            setTouched({
                name: false,
                collegeId: false,
                password: false,
                department: false
            });
        } else {
            setMessage("error");
        }
        setLoading(false);
    };

    const selectDepartment = (dept: string) => {
        setForm({ ...form, department: dept });
        setTouched({ ...touched, department: true });
        setIsDeptOpen(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        setTouched({ ...touched, [field]: true });
    };

    const nextStep = () => {
        // Validate current step before proceeding
        if (activeStep === 1) {
            if (!form.name || !form.collegeId || !form.password) {
                setTouched({
                    name: true,
                    collegeId: true,
                    password: true,
                    department: touched.department
                });
                return;
            }
        } else if (activeStep === 2) {
            if (!form.department) {
                setTouched({ ...touched, department: true });
                return;
            }
        }
        setActiveStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    const isFieldInvalid = (field: keyof typeof touched) => touched[field] && !form[field];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Professional Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Create New User
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Add students, faculty, or administrators to the system with our streamlined process
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Professional Progress Steps */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <div className="space-y-8">
                                {[
                                    { number: 1, title: "Personal Info", desc: "Basic details", icon: "👤" },
                                    { number: 2, title: "Account Type", desc: "Role & Department", icon: "🎯" },
                                    { number: 3, title: "Review & Create", desc: "Final details", icon: "✨" }
                                ].map((step) => (
                                    <div key={step.number} className="flex items-center space-x-4">
                                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                                            activeStep >= step.number 
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                                : "bg-slate-100 border-slate-200 text-slate-400"
                                        }`}>
                                            <span className="font-semibold text-sm">
                                                {activeStep >= step.number ? step.icon : step.number}
                                            </span>
                                            {activeStep > step.number && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-semibold text-sm ${
                                                activeStep >= step.number ? "text-slate-900" : "text-slate-400"
                                            }`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-500 text-xs mt-1">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                    <span className="font-medium">Progress</span>
                                    <span className="font-semibold">{Math.round((activeStep / 3) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className="bg-slate-900 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${(activeStep / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Form Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Step 1: Personal Info */}
                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <span>Full Name</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${
                                                    isFieldInvalid('name') 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'
                                                }`}>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter full name"
                                                        className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                        value={form.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {isFieldInvalid('name') && (
                                                    <p className="text-red-500 text-sm flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Full name is required</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* College ID Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <span>College ID</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${
                                                    isFieldInvalid('collegeId') 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'
                                                }`}>
                                                    <input
                                                        type="text"
                                                        placeholder="Example: 23UBC506"
                                                        className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                        value={form.collegeId}
                                                        onChange={(e) => handleInputChange('collegeId', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {isFieldInvalid('collegeId') && (
                                                    <p className="text-red-500 text-sm flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>College ID is required</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                <span>Password</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative rounded-lg border-2 transition-all duration-200 ${
                                                isFieldInvalid('password') 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'
                                            }`}>
                                                <input
                                                    type="password"
                                                    placeholder="Enter secure password"
                                                    className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                    value={form.password}
                                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {isFieldInvalid('password') && (
                                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Password is required</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Role & Department */}
                                {activeStep === 2 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Role Selection */}
                                            <div className="space-y-4">
                                                <label className="block text-sm font-semibold text-slate-700">
                                                    User Role
                                                </label>
                                                <div className="space-y-3">
                                                    {[
                                                        { value: "student", label: "Student", desc: "Learning access" },
                                                        { value: "faculty", label: "Faculty", desc: "Teaching access" },
                                                        { value: "admin", label: "Administrator", desc: "Full system access" }
                                                    ].map((role) => (
                                                        <label key={role.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-200">
                                                            <input
                                                                type="radio"
                                                                name="role"
                                                                value={role.value}
                                                                checked={form.role === role.value}
                                                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                                className="hidden"
                                                            />
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                                form.role === role.value 
                                                                    ? "border-slate-900 bg-slate-900" 
                                                                    : "border-slate-300"
                                                            }`}>
                                                                {form.role === role.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-slate-900 font-medium capitalize">{role.label}</div>
                                                                <div className="text-slate-500 text-sm">{role.desc}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Department Selection */}
                                            <div className="space-y-4">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <span>Department</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsDeptOpen(!isDeptOpen)}
                                                        className={`w-full text-left rounded-lg border-2 px-4 py-3 transition-all duration-200 flex items-center justify-between ${
                                                            isFieldInvalid('department')
                                                                ? 'border-red-300 bg-red-50 text-red-900'
                                                                : form.department
                                                                    ? 'border-slate-400 bg-white text-slate-900'
                                                                    : 'border-slate-200 hover:border-slate-300 text-slate-400'
                                                        }`}
                                                    >
                                                        <span className={form.department ? "text-slate-900" : "text-slate-400"}>
                                                            {form.department || "Select Department"}
                                                        </span>
                                                        <svg className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDeptOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>

                                                    {isDeptOpen && (
                                                        <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                                            <div className="p-3 border-b border-slate-100">
                                                                <h4 className="text-slate-700 text-sm font-semibold mb-2">Shift I</h4>
                                                                <div className="space-y-1">
                                                                    {shiftOne.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors duration-200"
                                                                        >
                                                                            {dept}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="p-3">
                                                                <h4 className="text-slate-700 text-sm font-semibold mb-2">Shift II</h4>
                                                                <div className="space-y-1">
                                                                    {shiftTwo.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors duration-200"
                                                                        >
                                                                            {dept}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {isFieldInvalid('department') && (
                                                    <p className="text-red-500 text-sm flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Department is required</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {activeStep === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <h3 className="text-slate-900 font-semibold text-lg mb-4">Review Details</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Full Name", value: form.name, required: true },
                                                    { label: "College ID", value: form.collegeId, required: true },
                                                    { label: "User Role", value: form.role, required: false },
                                                    { label: "Department", value: form.department, required: true }
                                                ].map((item, index) => (
                                                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-slate-600">{item.label}</span>
                                                            {item.required && <span className="text-red-500 text-sm">*</span>}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`font-medium ${
                                                                item.value ? "text-slate-900" : "text-red-500 italic"
                                                            }`}>
                                                                {item.value || "Not provided"}
                                                            </span>
                                                            {item.value ? (
                                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-8 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={activeStep === 1}
                                        className="px-8 py-3 border border-slate-300 rounded-lg text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span>Back</span>
                                    </button>

                                    {activeStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                                        >
                                            <span>Continue</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading || !form.name || !form.collegeId || !form.password || !form.department}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Create User</span>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Success/Error Message */}
                            {message && (
                                <div className={`mt-6 p-4 rounded-lg border ${
                                    message === "success" 
                                        ? "bg-green-50 border-green-200 text-green-800" 
                                        : "bg-red-50 border-red-200 text-red-800"
                                }`}>
                                    <div className="flex items-center space-x-3">
                                        {message === "success" ? (
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        <div>
                                            <h4 className={`font-semibold ${
                                                message === "success" ? "text-green-800" : "text-red-800"
                                            }`}>
                                                {message === "success" ? "User Created Successfully!" : "Please fill all required fields"}
                                            </h4>
                                            <p className="text-sm opacity-90">
                                                {message === "success" 
                                                    ? "The new user has been added to the system." 
                                                    : "All fields marked with * are required to continue."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}