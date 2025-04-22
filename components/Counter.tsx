"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <section className="bg-white shadow rounded-2xl p-6 w-80 text-center space-y-4">
            <p className="text-xl font-semibold">Count: {count}</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setCount((c) => c - 1)}
                    className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
                >
                    -1
                </button>
                <button
                    onClick={() => setCount((c) => c + 1)}
                    className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
                >
                    +1
                </button>
            </div>
        </section>
    );
}
