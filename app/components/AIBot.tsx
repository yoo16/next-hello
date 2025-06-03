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
        <div className="mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold">教えて！Gemini!</h2>
            <button
                onClick={getMessage}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 cursor-pointer">
                教えて!Gemini!
            </button>
            
            <div className="text-left p-3 bg-gray-100 rounded shadow text-sm whitespace-pre-wrap">
                {message}
            </div>
            {isLoading && <Loading />}
        </div>
    )
}
