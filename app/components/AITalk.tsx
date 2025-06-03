'use client';

import React from 'react';
import { startAudioSession } from '@/app/services/GeminiService';

export default function AITalk() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">AITalk</h2>
            <button
                onClick={startAudioSession}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                会話スタート
            </button>
        </div>
    );
}