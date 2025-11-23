"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await fetch("/api/users", {
                method: "GET",
                credentials: "include",
            });

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            const data = await res.json();

            if (data.role !== "admin") {
                router.push("/unauthorized");
                return;
            }

            setUsers(data.users);
            setLoading(false);
        }

        loadData();
    }, []);

    const handleLogout = async () => {
        // Call API to clear cookie
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    if (loading) return <p className="p-10 text-xl">Loading admin panel...</p>;

    return (
        <div className="p-10 mt-15">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="border rounded-xl p-5 shadow bg-white">
                <h2 className="text-xl mb-4 font-semibold">All Users</h2>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border">Name</th>
                            <th className="p-3 border">College ID</th>
                            <th className="p-3 border">Role</th>
                            <th className="p-3 border">Department</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u: any) => (
                            <tr key={u._id}>
                                <td className="p-3 border">{u.name}</td>
                                <td className="p-3 border">{u.collegeId}</td>
                                <td className="p-3 border capitalize">{u.role}</td>
                                <td className="p-3 border">{u.department || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
