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
    Settings,
    Eye,
    EyeOff,
    Phone,
    Mail
} from "lucide-react";

export default function AddUserPage() {
    const [form, setForm] = useState({
        name: "",
        collegeId: "",
        password: "",
        role: "student",
        department: "",
        shift: "",
        email: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeStep, setActiveStep] = useState(1);
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [touched, setTouched] = useState({
        name: false,
        collegeId: false,
        password: false,
        department: false,
        email: false,
        phone: false
    });

    const [showPassword, setshowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate fields
        const isDepartment = form.role === "department";
        if (!form.name || !form.collegeId || !form.password) {
            setMessage("Please fill in required fields");
            return;
        }
        // Only require department if NOT creating a department account
        if (!isDepartment && !form.department) {
            setMessage("Please select a department");
            return;
        }

        setLoading(true);
        setMessage("");

        // Determine API Endpoint
        const endpoint = isDepartment
            ? "/api/admin/create-department"
            : "/api/admin/create-user";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("success");
                // Reset form
                setForm({
                    name: "",
                    collegeId: "",
                    password: "",
                    role: "student",
                    department: "",
                    shift: "",
                    phone: "",
                    email: ""
                });
                setActiveStep(1);
                setTouched({
                    name: false,
                    collegeId: false,
                    password: false,
                    department: false,
                    email: false,
                    phone: false

                });
            } else {
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
        // Validate Step 1
        if (activeStep === 1) {
            if (!form.name || !form.collegeId || !form.password) {
                setTouched({
                    name: true,
                    collegeId: true,
                    password: true,
                    department: touched.department,
                    email: true,
                    phone: true
                });
                return;
            }
        }
        // Validate Step 2
        else if (activeStep === 2) {
            // If creating a department, we skip department selection validation
            if (form.role !== "department" && !form.department) {
                setTouched({ ...touched, department: true });
                return;
            }
        }
        setActiveStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    const isFieldInvalid = (field: keyof typeof touched) => touched[field] && !form[field];

    const stepIcons = [
        { icon: User, label: "Basic Info", description: "Name & Credentials" },
        { icon: Target, label: "Account Role", description: "Type & Access" },
        { icon: Sparkles, label: "Review", description: "Confirm details" }
    ];

    // Dynamic Labels based on Role
    const isDeptRole = form.role === "department";
    const nameLabel = isDeptRole ? "Department Name" : "Full Name";
    const idLabel = isDeptRole ? "Department ID (Username)" : "College ID";
    const namePlaceholder = isDeptRole ? "e.g. Information Technology" : "Enter full name";
    const idPlaceholder = isDeptRole ? "e.g. DEPT_IT" : "e.g. 23UBC506";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Create New Account
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Progress Steps */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm sticky top-8">
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
                                                <h3 className={`font-semibold text-sm ${activeStep >= index + 1 ? "text-slate-900" : "text-slate-400"}`}>
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
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-slate-800 to-slate-900 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${(activeStep / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[500px] flex flex-col justify-between">
                            <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                                {/* Step 1: Personal Info */}
                                {activeStep === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <User className="w-4 h-4" />
                                                    <span>{nameLabel}</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('name') ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={namePlaceholder}
                                                        className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                        value={form.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {isFieldInvalid('name') && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> Required</p>}
                                            </div>

                                            {/* College ID / Team ID Input */}
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                    <IdCard className="w-4 h-4" />
                                                    <span>{idLabel}</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('collegeId') ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={idPlaceholder}
                                                        className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                        value={form.collegeId}
                                                        onChange={(e) => handleInputChange('collegeId', e.target.value.toUpperCase())}
                                                        required
                                                    />
                                                </div>
                                                {isFieldInvalid('collegeId') && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> Required</p>}
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                <Lock className="w-4 h-4" />
                                                <span>Password</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className={`relative flex items-center pr-4 rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('password') ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'}`}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter secure password"
                                                    className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                    value={form.password}
                                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                                    required
                                                />
                                                <div className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => setshowPassword(prev => !prev)}>
                                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </div>
                                            </div>
                                            {isFieldInvalid('password') && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> Required</p>}
                                        </div>

                                        {/* phone number */}
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                <Phone className="w-4 h-4" />
                                                <span>Phone Number</span>
                                                <span className="text-red-500">*</span>
                                            </label>

                                            <div
                                                className={`relative flex items-center pr-4 rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('phone')
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'
                                                    }`}
                                            >
                                                <input
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                    value={form.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            {isFieldInvalid('phone') && (
                                                <p className="text-red-500 text-xs flex items-center mt-1">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> Required
                                                </p>
                                            )}
                                        </div>

                                        {/* EMAIL */}
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                <Mail className="w-4 h-4" />
                                                <span>Email</span>
                                                <span className="text-red-500">*</span>
                                            </label>

                                            <div
                                                className={`relative flex items-center pr-4 rounded-lg border-2 transition-all duration-200 ${isFieldInvalid('email')
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-slate-200 hover:border-slate-300 focus-within:border-slate-400'
                                                    }`}
                                            >
                                                <input
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    className="w-full bg-transparent rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                                                    value={form.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            {isFieldInvalid('email') && (
                                                <p className="text-red-500 text-xs flex items-center mt-1">
                                                    <AlertCircle className="w-3 h-3 mr-1" /> Required
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
                                                    <span>Account Role</span>
                                                </label>
                                                <div className="space-y-3">
                                                    {[
                                                        { value: "student", label: "Student", desc: "User Account", icon: GraduationCap },
                                                        { value: "faculty", label: "Faculty", desc: "User Account", icon: Users },
                                                        { value: "admin", label: "Administrator", desc: "System Admin", icon: Settings },
                                                        { value: "department", label: "Department", desc: "Team/Group Account", icon: Building2 }
                                                    ].map((role) => {
                                                        const RoleIcon = role.icon;
                                                        return (
                                                            <label key={role.value} className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.role === role.value ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="role"
                                                                    value={role.value}
                                                                    checked={form.role === role.value}
                                                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                                    className="hidden"
                                                                />
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.role === role.value ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
                                                                    <RoleIcon size={16} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-slate-900 font-semibold text-sm">{role.label}</div>
                                                                    <div className="text-slate-500 text-xs">{role.desc}</div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Department Selection - Only shown if role is NOT department */}
                                            {!isDeptRole && (
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
                                                                : form.department ? 'border-slate-400 bg-white text-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-400'
                                                                }`}
                                                        >
                                                            <span>{form.department || "Select Department"}</span>
                                                            <ChevronDown className={`w-5 h-5 transition-transform ${isDeptOpen ? "rotate-180" : ""}`} />
                                                        </button>

                                                        {isDeptOpen && (
                                                            <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                                                <div className="p-3 border-b border-slate-100">
                                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shift I</h4>
                                                                    <div className="space-y-1">
                                                                        {shiftOne.map((dept) => (
                                                                            <button key={dept} type="button" onClick={() => selectDepartment(dept)} className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 flex items-center gap-2">
                                                                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> {dept}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="p-3">
                                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shift II</h4>
                                                                    <div className="space-y-1">
                                                                        {shiftTwo.map((dept) => (
                                                                            <button key={dept} type="button" onClick={() => selectDepartment(dept)} className="w-full text-left px-3 py-2 text-slate-700 text-sm rounded hover:bg-slate-50 flex items-center gap-2">
                                                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> {dept}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isFieldInvalid('department') && <p className="text-red-500 text-xs flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1" /> Required</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {activeStep === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-900 font-semibold text-lg">Confirm Creation</h3>
                                                    <p className="text-slate-600 text-sm">Please review the details below</p>
                                                </div>
                                            </div>
                                            <div className="space-y-0 divide-y divide-slate-200">
                                                <div className="flex justify-between py-3">
                                                    <span className="text-slate-500 text-sm">{nameLabel}</span>
                                                    <span className="font-medium text-slate-900">{form.name}</span>
                                                </div>
                                                <div className="flex justify-between py-3">
                                                    <span className="text-slate-500 text-sm">{idLabel}</span>
                                                    <span className="font-medium text-slate-900">{form.collegeId}</span>
                                                </div>
                                                <div className="flex justify-between py-3">
                                                    <span className="text-slate-500 text-sm">Role</span>
                                                    <span className="font-medium capitalize text-slate-900">{form.role}</span>
                                                </div>
                                                {/* Shift Selection — Only for Department Role */}
                                                {isDeptRole && (
                                                    <div className="space-y-4">
                                                        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>Department Shift</span>
                                                            <span className="text-red-500">*</span>
                                                        </label>

                                                        <select
                                                            value={form.shift}
                                                            onChange={(e) => handleInputChange("shift", e.target.value)}
                                                            className="w-full border-2 border-slate-300 px-4 py-3 rounded-lg text-slate-900 bg-white"
                                                        >
                                                            <option value="">Select Shift</option>
                                                            <option value="Shift I">Shift I</option>
                                                            <option value="Shift II">Shift II</option>
                                                        </select>

                                                        {touched.name && !form.shift && (
                                                            <p className="text-red-500 text-xs flex items-center mt-1">
                                                                <AlertCircle className="w-3 h-3 mr-1" /> Shift is required
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex justify-between py-3">
                                                    <span className="text-slate-500 text-sm">Password</span>
                                                    <span className="font-medium text-slate-900 font-mono">
                                                        {showPassword ? form.password : "•".repeat(form.password.length)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-8 border-t border-slate-200 mt-6">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={activeStep === 1}
                                    className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all font-medium flex items-center"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                </button>

                                {activeStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200"
                                    >
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 transition-all flex items-center shadow-lg shadow-green-200"
                                    >
                                        {loading ? "Creating..." : "Create Account"}
                                        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                                    </button>
                                )}
                            </div>

                            {/* Messages */}
                            {message && (
                                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center ${message === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                    {message === "success" ? <Check className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                                    {message === "success" ? "Account created successfully!" : message}
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