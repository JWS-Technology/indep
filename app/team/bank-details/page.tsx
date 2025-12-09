"use client";
import React, { useState } from "react";

const Page = () => {
  const [teamName, setTeamName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      teamName,
      managerName,
      accountNo,
      bankName,
      ifsc,
    };
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <input
          type="text"
          placeholder="Team Name"
          className="border p-2 w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Manager Name"
          className="border p-2 w-full"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Account Number"
          className="border p-2 w-full"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Bank Name"
          className="border p-2 w-full"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />

        <input
          type="text"
          placeholder="IFSC Code"
          className="border p-2 w-full uppercase"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value.toUpperCase())}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
