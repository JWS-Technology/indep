"use client";

import { useState } from "react";
import {
    User, Mail, Phone, Lock, GraduationCap, Briefcase,
    Loader2, CheckCircle2, AlertCircle, ShieldCheck
} from "lucide-react";
import InputField from "./InputField";

export default function UserCard({
    role,
    isCreated,
    teamName,
    onSuccess,
}: {
    role: "faculty" | "student";
    isCreated: boolean;
    teamName: string;
    onSuccess: () => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        collegeId: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.collegeId || !formData.password) {
            setError("Name, ID, and Password are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    department: teamName,
                    role,
                }),
            });
            const data = await res.json();

            if (data.success) {
                onSuccess();
                setError(""); // clear error
                alert("🎉 User created successfully!");
                return;
            } else setError(data.message || "Failed to create user.");
        } catch {
            setError("Network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFaculty = role === "faculty";

    const config = isFaculty
        ? {
            color: "indigo",
            title: "Faculty Representative",
            icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            btn: "bg-indigo-600 hover:bg-indigo-700",
            focus: "focus:ring-indigo-500",
        }
        : {
            color: "violet",
            title: "Student Representative",
            icon: <GraduationCap className="w-5 h-5 text-violet-600" />,
            bg: "bg-violet-50",
            border: "border-violet-100",
            btn: "bg-violet-600 hover:bg-violet-700",
            focus: "focus:ring-violet-500",
        };

    // If already created →
    if (isCreated) {
        return (
            <div
                className={`h-full p-8 rounded-2xl border ${config.border} ${config.bg}
                relative overflow-hidden flex flex-col items-center justify-center
                text-center shadow-sm`}
            >
                <div className="absolute inset-0 bg-white/40" />
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                        <CheckCircle2 className={`w-8 h-8 text-${config.color}-600`} />
                    </div>
                    <h3 className={`text-xl font-bold text-${config.color}-900`}>
                        {config.title}
                    </h3>
                    <p className={`text-${config.color}-700 mt-2`}>
                        Account is active and configured.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full border border-gray-100/50">
                        <ShieldCheck className="w-4 h-4" />
                        Securely Registered
                    </div>
                </div>
            </div>
        );
    }

    // Creation form →
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${config.bg}`}>{config.icon}</div>
                    {config.title}
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
                    Not Created
                </span>
            </div>

            <div className="space-y-4">

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <InputField
                    icon={<User />}
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    focusColor={config.focus}
                />

                <InputField
                    icon={isFaculty ? <Briefcase /> : <GraduationCap />}
                    name="collegeId"
                    placeholder={isFaculty ? "Faculty ID" : "Registration Number"}
                    value={formData.collegeId.toUpperCase()}
                    onChange={handleChange}
                    focusColor={config.focus}
                />

                <div className="grid grid-cols-2 gap-3">
                    <InputField
                        icon={<Mail />}
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        focusColor={config.focus}
                    />
                    <InputField
                        icon={<Phone />}
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        focusColor={config.focus}
                    />
                </div>

                <InputField
                    icon={<Lock />}
                    name="password"
                    type="password"
                    placeholder="Set Login Password"
                    value={formData.password}
                    onChange={handleChange}
                    focusColor={config.focus}
                />

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full mt-2 py-3 rounded-xl text-white font-medium transition-all shadow-md 
                    flex items-center justify-center gap-2 
                    ${config.btn} 
                    disabled:opacity-60`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                        </>
                    ) : (
                        `Create ${isFaculty ? "Faculty" : "Student"} Account`
                    )}
                </button>
            </div>
        </div>
    );
}
