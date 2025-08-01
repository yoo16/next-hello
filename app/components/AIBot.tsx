"use client"

// rfc で作成
import React, { useState } from 'react'
import Loading from './Loading';

export default function AIBot() {
    const [message, setMessage] = useState("Geminiに聞いてみよう！");
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (text && confirm('Geminiに聞いてみますか？')) {
            // setMessage("Geminiに聞いています...");
            // ローディングフラグをオンにする
            setIsLoading(true);
            // APIにリクエストを送信
            const res = await fetch('/api/gemini',
                {
                    method: 'POST',
                    body: JSON.stringify({ "text": text }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await res.json();
            setMessage(data.message);
            // ローディングフラグをオフにする
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold">教えて！Gemini!</h2>
            {/* テキストボックス */}
            <input type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="質問を入力してください"
                className="w-full px-3 py-2 border border-gray-400 rounded"
            />

            <div className="text-left p-3 bg-gray-100 rounded shadow text-sm whitespace-pre-wrap">
                {message}
            </div>
            <button
                onClick={sendMessage}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 cursor-pointer">
                教えて!Gemini!
            </button>

            {/* ローディング表示 */}
            {isLoading && <Loading />}
        </div>
    )
}