"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IdCard, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"; // Switched User icon to IdCard

export default function Login() {
    const router = useRouter();

    // 1. Changed state from email to collegeId
    const [form, setForm] = useState({ collegeId: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Ensure we send the ID, maybe force uppercase if that's your format
                    collegeId: form.collegeId.trim(),
                    password: form.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || "Invalid credentials");
                setIsLoading(false);
                return;
            }

            // Redirect logic based on the new rule:
            // Faculty = President -> /faculty/dashboard
            // Student = Secretary -> /student/dashboard
            const role = data.role?.toLowerCase();

            if (role === "admin") {
                router.push("/admin/dashboard");
            } else if (role === "faculty" || role === "president") {
                router.push("/faculty/dashboard");
            } else if (role === "judge") {
                router.push("/judge/dashboard");
            } else {
                // Default fallback for 'student' or 'secretary'
                router.push("/student/dashboard");
            }

        } catch (error) {
            setErrorMsg("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center mt-10 bg-gray-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">

                {/* LEFT SIDE - BRANDING / VISUALS */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-bold tracking-widest uppercase mb-2">Indep '25</h2>
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10 mb-12">
                        <h1 className="text-5xl font-black mb-4 leading-tight">
                            Cultural <br /> Extravaganza
                        </h1>
                        <p className="text-indigo-100 text-lg font-light">
                            Welcome Presidents & Secretaries. Manage events, scores, and participation all in one place.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-indigo-200">
                        Powered by JWS Technologies
                    </div>
                </div>

                {/* RIGHT SIDE - LOGIN FORM */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-sm mx-auto w-full"
                    >
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h2>
                            <p className="text-gray-500">Please enter your College ID to sign in.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* College ID Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">College ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <IdCard size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={form.collegeId}
                                        onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="e.g. 23UBC506"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Error Message */}
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                                    {errorMsg}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}