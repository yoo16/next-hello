"use client"

import React, { useState } from 'react'
import Loading from '@/app/components/Loading';

export default function AIBot() {
    const [message, setMessage] = useState("Geminiに聞いてみよう！");
    const [isLoading, setIsLoading] = useState(false);

    const getMessage = async () => {
        setIsLoading(true);
        const res = await fetch('/api/gemini');
        const data = await res.json();
        setIsLoading(false);
        setMessage(data.message);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold">教えて！Gemini!</h2>
            <div className="text-left p-4">
                {message}
            </div>
            <button
                onClick={getMessage}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 cursor-pointer">
                教えて!Gemini!
            </button>
            {isLoading && <Loading />}
        </div>
    )
}
