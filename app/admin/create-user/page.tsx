"use client";

import { useState } from "react";
import { shiftOne, shiftTwo } from "@/data/teams";
import {
    User,
    IdCard,
    Lock,
    Building2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertCircle,
    ArrowRight,
    Users,
    Target,
    Sparkles,
    Shield,
    GraduationCap,
    Settings
} from "lucide-react";

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
            setMessage("Please fill in all fields"); // Better message
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("success");
                // Reset form logic...
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
                // 🔥 KEY FIX: Set the actual error message from the server
                setMessage(data.error || "Failed to create user");
            }
        } catch (error) {
            setMessage("Network error occurred");
        } finally {
            setLoading(false);
        }
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

    const stepIcons = [
        { icon: User, label: "Personal Info", description: "Basic details" },
        { icon: Target, label: "Account Type", description: "Role & Department" },
        { icon: Sparkles, label: "Review & Create", description: "Final details" }
    ];

    const roleIcons = {
        student: GraduationCap,
        faculty: Users,
        admin: Settings
    };

    return (
        <div className="min-h -screen bg-gradient-to-br  from-slate-50 via-white to-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Professional Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Create New User
                    </h1>
                    {/* <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Add students, faculty, or administrators to the system with our streamlined process
                    </p> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Professional Progress Steps */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <div className="space-y-8">
                                {stepIcons.map((step, index) => {
                                    const IconComponent = step.icon;
                                    return (
                                        <div key={index} className="flex items-center space-x-4">
                                            <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${activeStep >= index + 1
                                                ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-900 text-white shadow-md"
                                                : "bg-slate-100 border-slate-200 text-slate-400"
                                                }`}>
                                                <IconComponent className="w-5 h-5" />
                                                {activeStep > index + 1 && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm ${activeStep >= index + 1 ? "text-slate-900" : "text-slate-400"
                                                    }`}>
                                                    {step.label}
                                                </h3>
                                                <p className="text-slate-500 text-xs mt-1">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                    <span className="font-medium">Progress</span>
                                    <span className="font-semibold">{Math.round((activeStep / 3) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-slate-800 to-slate-900 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${(activeStep / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Form Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Step 1: Personal Info */}
                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <User className="w-4 h-4" />
                                                    <span>Full Name</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('name')
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
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>Full name is required</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* College ID Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <IdCard className="w-4 h-4" />
                                                    <span>College ID</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('collegeId')
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
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>College ID is required</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                <Lock className="w-4 h-4" />
                                                <span>Password</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('password')
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
                                                    <AlertCircle className="w-4 h-4" />
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
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <Shield className="w-4 h-4" />
                                                    <span>User Role</span>
                                                </label>
                                                <div className="space-y-3">
                                                    {[
                                                        { value: "student", label: "Student", desc: "Learning access", icon: GraduationCap },
                                                        { value: "faculty", label: "Faculty", desc: "Teaching access", icon: Users },
                                                        { value: "admin", label: "Administrator", desc: "Full system access", icon: Settings }
                                                    ].map((role) => {
                                                        const RoleIcon = role.icon;
                                                        return (
                                                            <label key={role.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-200">
                                                                <input
                                                                    type="radio"
                                                                    name="role"
                                                                    value={role.value}
                                                                    checked={form.role === role.value}
                                                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${form.role === role.value
                                                                    ? "border-slate-900 bg-slate-900"
                                                                    : "border-slate-300"
                                                                    }`}>
                                                                    {form.role === role.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                                </div>
                                                                <div className="flex items-center space-x-3 flex-1">
                                                                    <div className={`p-2 rounded-lg ${form.role === role.value ? 'bg-slate-100' : 'bg-slate-50'
                                                                        }`}>
                                                                        <RoleIcon className={`w-4 h-4 ${form.role === role.value ? 'text-slate-900' : 'text-slate-500'
                                                                            }`} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="text-slate-900 font-medium capitalize">{role.label}</div>
                                                                        <div className="text-slate-500 text-sm">{role.desc}</div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Department Selection */}
                                            <div className="space-y-4">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>Department</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsDeptOpen(!isDeptOpen)}
                                                        className={`w-full text-left rounded-lg border-2 px-4 py-3 transition-all duration-200 flex items-center justify-between ${isFieldInvalid('department')
                                                            ? 'border-red-300 bg-red-50 text-red-900'
                                                            : form.department
                                                                ? 'border-slate-400 bg-white text-slate-900'
                                                                : 'border-slate-200 hover:border-slate-300 text-slate-400'
                                                            }`}
                                                    >
                                                        <span className={form.department ? "text-slate-900" : "text-slate-400"}>
                                                            {form.department || "Select Department"}
                                                        </span>
                                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDeptOpen ? "rotate-180" : ""}`} />
                                                    </button>

                                                    {isDeptOpen && (
                                                        <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                                            <div className="p-3 border-b border-slate-100">
                                                                <h4 className="text-slate-700 text-sm font-semibold mb-2 flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                    <span>Shift I</span>
                                                                </h4>
                                                                <div className="space-y-1">
                                                                    {shiftOne.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                                                            <span>{dept}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="p-3">
                                                                <h4 className="text-slate-700 text-sm font-semibold mb-2 flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span>Shift II</span>
                                                                </h4>
                                                                <div className="space-y-1">
                                                                    {shiftTwo.map((dept) => (
                                                                        <button
                                                                            key={dept}
                                                                            type="button"
                                                                            onClick={() => selectDepartment(dept)}
                                                                            className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                                            <span>{dept}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {isFieldInvalid('department') && (
                                                    <p className="text-red-500 text-sm flex items-center space-x-1">
                                                        <AlertCircle className="w-4 h-4" />
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
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-900 font-semibold text-lg">Review Details</h3>
                                                    <p className="text-slate-600 text-sm">Confirm all information before creating the user</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Full Name", value: form.name, required: true, icon: User },
                                                    { label: "College ID", value: form.collegeId, required: true, icon: IdCard },
                                                    { label: "User Role", value: form.role, required: false, icon: Shield },
                                                    { label: "Department", value: form.department, required: true, icon: Building2 }
                                                ].map((item, index) => {
                                                    const ItemIcon = item.icon;
                                                    return (
                                                        <div key={item.label} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                                    <ItemIcon className="w-4 h-4 text-slate-600" />
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-slate-600">{item.label}</span>
                                                                    {item.required && <span className="text-red-500 text-sm">*</span>}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`font-medium ${item.value ? "text-slate-900" : "text-red-500 italic"
                                                                    }`}>
                                                                    {item.value || "Not provided"}
                                                                </span>
                                                                {item.value ? (
                                                                    <Check className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Back</span>
                                    </button>

                                    {activeStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                                        >
                                            <span>Continue</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading || !form.name || !form.collegeId || !form.password || !form.department}
                                            className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Create User</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Success/Error Message */}
                            {message && (
                                <div className={`mt-6 p-4 rounded-lg border ${message === "success"
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                    }`}>
                                    <div className="flex items-center space-x-3">
                                        {message === "success" ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        )}
                                        <div>
                                            <h4 className={`font-semibold ${message === "success" ? "text-green-800" : "text-red-800"
                                                }`}>
                                                {message === "success" ? "User Created Successfully!" : "Error"}
                                            </h4>
                                            <p className="text-sm opacity-90">
                                                {/* Display the actual message here */}
                                                {message === "success"
                                                    ? "The new user has been added to the system."
                                                    : message}
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