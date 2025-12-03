
"use client";

import React from "react";

export default function InputField({
    icon,
    focusColor,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    icon: React.ReactNode;
    focusColor: string;
}) {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <input
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200
                    rounded-xl outline-none transition-all
                    ${focusColor} focus:bg-white focus:ring-2`}
                {...props}
            />
        </div>
    );
}
