"use client";

import { useEffect, useState } from "react";

export default function UsersList() {
    const [role, setRole] = useState<"faculty" | "student">("student");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`/api/coordinator/users?role=${role}`)
            .then((res) => res.json())
            .then((data) => setUsers(data.users || []));
    }, [role]);

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Users List</h1>

            {/* Toggle Buttons */}
            <div className="flex gap-4 mb-4">


                <button
                    className={`px-4 py-2 rounded ${role === "student" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setRole("student")}
                >
                    Students
                </button>
                <button
                    className={`px-4 py-2 rounded ${role === "faculty" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setRole("faculty")}
                >
                    Faculty
                </button>
            </div>

            {/* Display Users */}
            <div className="space-y-3">
                {users.map((u: any) => (
                    <div key={u._id} className="p-4 border rounded-lg shadow-sm bg-white">
                        <p><b>Name:</b> {u.name}</p>
                        <p><b>College ID:</b> {u.collegeId}</p>
                        {/* <p><b>Email:</b> {u.email}</p> */}
                        <p><b>Phone:</b><a href={`tel:+91${u.phone}`}> {u.phone}</a> </p>
                        <p><b>Department:</b> {u.department}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
