"use client";

import { useState, FormEvent } from "react";

export default function PostTest() {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");

    const handlePostTest = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/echo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            const data = await res.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("送信エラー:", err);
            setResult("送信に失敗しました");
        }
    };

    return (
        <section className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">POSTテスト</h1>
            <form onSubmit={handlePostTest} className="space-y-4">
                <input
                    type="text"
                    className="border border-gray-300 rounded w-full px-3 py-2"
                    placeholder="送信するテキスト"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    送信
                </button>
            </form>

            <div className="mt-6 bg-gray-100 p-4 rounded">
                <h2 className="font-bold mb-2">レスポンス:</h2>
                <pre className="text-left whitespace-pre-wrap">{result}</pre>
            </div>
        </section>
    );
}
