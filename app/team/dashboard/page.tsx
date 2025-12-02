"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, UserPlus, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";

export default function DepartmentDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // State to track Department Data
    const [teamData, setTeamData] = useState<any>(null);

    // Forms State
    const [newPassword, setNewPassword] = useState("");
    const [userForm, setUserForm] = useState({
        name: "",
        collegeId: "",
        email: "",
        phone: "",
        password: "" // Optional, or auto-generated
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Team Status on Load
    useEffect(() => {
        fetchTeamStatus();
    }, []);

    const fetchTeamStatus = async () => {
        try {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (!data.success) {
                router.push("/login"); // Redirect if not logged in
                return;
            }
            setTeamData(data.team);
        } catch (error) {
            console.error("Failed to fetch status");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLER: Change Password ---
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
                router.push("/login");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Error updating password");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HANDLER: Create User (Faculty/Student) ---
    const handleCreateUser = async (role: "faculty" | "student") => {
        if (!userForm.name || !userForm.collegeId) return alert("Please fill all fields");

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/department/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userForm, role }),
            });
            const data = await res.json();

            if (data.success) {
                alert(`${role.toUpperCase()} created successfully!`);
                setUserForm({ name: "", collegeId: "", email: "", phone: "", password: "" }); // Reset
                fetchTeamStatus(); // Refresh to update UI checks
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    // 🔴 STATE 1: FORCE PASSWORD CHANGE
    if (!teamData?.isPasswordChanged) {
        // {console.log(teamData?.isPasswordChanged)}
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-red-100">
                    <div className="text-center mb-6">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Security Update Required</h1>
                        <p className="text-gray-500 mt-2">
                            For security reasons, you must change your default password before accessing the dashboard.
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

    // 🟢 STATE 2: MAIN DASHBOARD (Create Users)
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{teamData.teamName} Dashboard</h1>
                    <p className="text-gray-500">Manage your department representatives</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* --- FACULTY CARD --- */}
                    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${teamData.membersCreated.faculty ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="w-5 h-5" /> Faculty Representative
                            </h2>
                            {teamData.membersCreated.faculty && <CheckCircle className="text-green-500 w-6 h-6" />}
                        </div>

                        {teamData.membersCreated.faculty ? (
                            <div className="text-center py-8 text-green-700 font-medium bg-green-100 rounded-xl">
                                Faculty Representative Created
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    placeholder="Faculty Name"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                />
                                <input
                                    placeholder="Faculty ID (College ID)"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, collegeId: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        placeholder="Email"
                                        className="w-full p-3 border rounded-lg"
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                    <input
                                        placeholder="Phone"
                                        className="w-full p-3 border rounded-lg"
                                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Set Login Password"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                />
                                <button
                                    onClick={() => handleCreateUser("faculty")}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium"
                                >
                                    Create Faculty Account
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- STUDENT CARD --- */}
                    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${teamData.membersCreated.student ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="w-5 h-5" /> Student Representative
                            </h2>
                            {teamData.membersCreated.student && <CheckCircle className="text-green-500 w-6 h-6" />}
                        </div>

                        {teamData.membersCreated.student ? (
                            <div className="text-center py-8 text-green-700 font-medium bg-green-100 rounded-xl">
                                Student Representative Created
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Reusing inputs for simplicity, in real app ensure state doesn't conflict or clear after one use */}
                                <input
                                    placeholder="Student Name"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                />
                                <input
                                    placeholder="Student ID (Reg No)"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, collegeId: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        placeholder="Email"
                                        className="w-full p-3 border rounded-lg"
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                    <input
                                        placeholder="Phone"
                                        className="w-full p-3 border rounded-lg"
                                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Set Login Password"
                                    className="w-full p-3 border rounded-lg"
                                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                />
                                <button
                                    onClick={() => handleCreateUser("student")}
                                    disabled={isSubmitting}
                                    className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 font-medium"
                                >
                                    Create Student Account
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}