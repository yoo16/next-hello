"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    // ➕ 増加ハンドラー
    const handleIncrement = () => {
        setCount((prev) => prev + 1);
    };

    // ➖ 減少ハンドラー
    const handleDecrement = () => {
        setCount((prev) => prev - 1);
    };

    // ➖ リセットハンドラー
    const handleReset = () => {
        setCount(0);
    };


    return (
        <section className="bg-white shadow rounded-2xl p-6 w-80 text-center space-y-4">
            <p className="text-xl font-semibold">{count}</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleDecrement}
                    className="bg-sky-500 text-white px-4 py-2 rounded-xl"
                >
                    -1
                </button>
                <button
                    onClick={handleReset}
                    className="bg-sky-500 text-white px-4 py-2 rounded-xl"
                >
                    Reset
                </button>
                <button
                    onClick={handleIncrement}
                    className="bg-sky-500 text-white px-4 py-2 rounded-xl"
                >
                    +1
                </button>
            </div>
        </section>
    );
}