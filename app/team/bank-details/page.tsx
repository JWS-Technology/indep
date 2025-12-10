"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Page = () => {
    const [teamName, setTeamName] = useState("");
    const [teamId, setteamId] = useState("");
    const [managerName, setManagerName] = useState("");
    const [accountNo, setAccountNo] = useState("");
    const [bankName, setBankName] = useState("");
    const [ifsc, setIfsc] = useState("");

    const [UserLoading, setUserLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // state for success message

    useEffect(() => {
        if (!teamId) return;
        const getBankDetails = async () => {
            try {
                const res = await axios.post("/api/get-bank-details", {
                    teamId,
                });

                setManagerName(res.data.bankDetails.managerName || "");
                setAccountNo(res.data.bankDetails.accountNumber || "");
                setBankName(res.data.bankDetails.bankName || "");
                setIfsc(res.data.bankDetails.ifscCode || "");
                console.log(res.data.bankDetails);
            } catch (error) {
                console.log(error);
            }
        };
        getBankDetails();
    }, [teamId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/save-bank-details", {
                teamId,
                teamName,
                managerName,
                accountNo,
                ifsc,
                bankName,
            });
            console.log(res.data);

            // set and show success message
            const msg = res.data?.message || "Bank details saved successfully";
            setSuccessMessage(msg);
            if (!res.data?.success) {
                toast.error(msg);
                return;
            }
            toast.success(msg);
        } catch (error: any) {
            console.log(error);
            const errMsg = error?.response?.data?.message || "Failed to save details";
            toast.error(errMsg);
        }
    };

    // get user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserLoading(true);
                const res = await fetch("/api/me", {
                    method: "GET",
                    cache: "no-cache",
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(
                        errorData.message || `HTTP ${res.status}: Failed to load user data`
                    );
                }

                const data = await res.json();

                const teamName = data.team?.teamName || "";
                const teamId = data.team?.teamId || "";

                setTeamName(teamName);
                setteamId(teamId);
            } catch (err: any) {
                console.error("Error fetching user data:", err);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex items-center justify-center p-6 bg-gray-50 min-h-screen">
            <ToastContainer position="top-right" autoClose={4000} />
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-200">
                <header>
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                        Team & Banking Details
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                        Review team details and enter banking information for disbursement.
                    </p>
                </header>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* --- Read-Only Team Details Section --- */}
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-inner">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                            Team Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Team Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500">
                                    Team Name
                                </label>
                                <p className="mt-1 text-sm font-bold text-gray-800 p-2 bg-white rounded border border-gray-300">
                                    {teamName || (UserLoading ? "Loading..." : "N/A")}
                                </p>
                            </div>

                            {/* Team ID */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500">
                                    Team ID
                                </label>
                                <p className="mt-1 text-sm font-bold text-gray-800 p-2 bg-white rounded border border-gray-300">
                                    {teamId || (UserLoading ? "Loading..." : "N/A")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- Editable Banking/Manager Details Section --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Manager & Bank Account Details
                        </h3>

                        {/* Manager Name */}
                        <div>
                            <label
                                htmlFor="managerName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Manager Name
                            </label>
                            <input
                                id="managerName"
                                type="text"
                                placeholder="e.g., Jane Doe"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={managerName}
                                onChange={(e) => setManagerName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label
                                htmlFor="accountNo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Account Number
                            </label>
                            <input
                                id="accountNo"
                                type="text"
                                placeholder="Enter full account number"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                                required
                            />
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label
                                htmlFor="bankName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Bank Name
                            </label>
                            <input
                                id="bankName"
                                type="text"
                                placeholder="e.g., SBI"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                required
                            />
                        </div>

                        {/* IFSC Code */}
                        <div>
                            <label
                                htmlFor="ifsc"
                                className="block text-sm font-medium text-gray-700"
                            >
                                IFSC Code
                            </label>
                            <input
                                id="ifsc"
                                type="text"
                                placeholder="e.g., CBOT0001234"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase tracking-widest"
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                                maxLength={11}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Save Details
                        </button>
                    </div>
                </form>

                {/* optionally show last success message below form */}
                {/* {successMessage && (
          <div className="mt-2 text-center text-sm text-green-600">
            {successMessage}
          </div>
        )} */}
            </div>
        </div>
    );
};

export default Page;
