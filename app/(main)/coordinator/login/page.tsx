"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserCog,
    IdCard,
    Lock,
    ArrowRight,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";

export default function CoordinatorLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ dNo: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/coordinator/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to coordinator dashboard
                router.push("/coordinator/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 mt-10 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

                    {/* Header Section */}
                    <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 z-0"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                                <UserCog className="w-8 h-8 text-indigo-300" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Coordinator Login</h1>
                            <p className="text-indigo-200 text-sm">Access your event management dashboard</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Department No Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Department No.
                                </label>
                                <div className="relative group">
                                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={form.dNo}
                                        onChange={(e) => setForm({ ...form, dNo: e.target.value.toUpperCase() })}
                                        placeholder="e.g. 23UCH210"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-xs text-slate-400">
                            Having trouble logging in? Contact the Admin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}