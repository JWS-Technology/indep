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
            setMessage("✅ User created successfully!");

            setForm({
                name: "",
                collegeId: "",
                password: "",
                role: "student",
                department: "",
            });
        } else {
            setMessage("❌ " + (data.error || "Something went wrong"));
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mt-20 mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Add New User</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    required
                />

                {/* College ID */}
                <input
                    type="text"
                    placeholder="College ID (Example: 23UBC506)"
                    className="w-full p-2 border rounded"
                    value={form.collegeId}
                    onChange={(e) =>
                        setForm({ ...form, collegeId: e.target.value })
                    }
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                />

                {/* Role */}
                <select
                    className="w-full p-2 border rounded"
                    value={form.role}
                    onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                    }
                >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                </select>

                {/* Department Dropdown */}
                <select
                    className="w-full p-2 border rounded"
                    value={form.department}
                    onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                    }
                    required
                >
                    <option value="">Select Department</option>

                    <optgroup label="Shift I">
                        {shiftOne.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </optgroup>

                    <optgroup label="Shift II">
                        {shiftTwo.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </optgroup>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-sm">{message}</p>
            )}
        </div>
    );
}
