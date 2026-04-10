"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [snippets, setSnippets] = useState([]);

    const fetchSnippets = async () => {
        try {
            const res = await axios.get("/api/snippets");
            setSnippets(res.data.snippets);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/snippets");
                setSnippets(res.data.snippets);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-(--bg) text-(--text)">
            <h1 className="text-2xl mb-6 font-bold">Your Snippets</h1>

            <div className="grid gap-4">
                {snippets.map((s) => (
                    <div
                        key={s._id}
                        className="p-4 rounded-lg border border-(--border) bg-(--card)"
                    >
                        <h2 className="font-semibold">{s.title}</h2>
                        <p className="text-sm opacity-70">{s.language}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
