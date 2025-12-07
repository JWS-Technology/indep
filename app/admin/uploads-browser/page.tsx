"use client";
import { useEffect, useState } from "react";

export default function UploadsBrowser() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/list-uploads")
            .then((res) => res.json())
            .then((result) => setData(result.files || []));
    }, []);

    function renderTree(items: any[]) {
        return (
            <ul style={{ marginLeft: 20 }}>
                {items.map((item, i) => (
                    <li key={i}>
                        {item.type === "folder" ? (
                            <>
                                📁 <strong>{item.name}</strong>
                                {renderTree(item.children)}
                            </>
                        ) : (
                            <>
                                📄{" "}
                                <a
                                    href={item.url.replace("/public", "")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.name}
                                </a>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Uploads Directory Viewer</h2>
            {renderTree(data)}
        </div>
    );
}
