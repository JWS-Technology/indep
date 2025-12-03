"use client";

import { ShieldAlert, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ForcePasswordChange({ onPasswordUpdated }: { onPasswordUpdated: () => void }) {
    const [newPassword, setNewPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Password updated! Please login again.");
                onPasswordUpdated();
            } else {
                alert(data.error);
            }
        } catch {
            alert("Error updating password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-red-100">
                <div className="text-center mb-6">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Security Update Required</h1>
                    <p className="text-gray-500 mt-2">
                        You must change your default password before accessing the dashboard.
                    </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="Enter new secure password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Updating..." : "Update Password & Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
