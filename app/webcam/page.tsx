'use client'

import React from 'react'

export default function page() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Face API</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <a href="face_landmark" className="px-3 py-2 rounded bg-sky-500 text-white">ランドマーク</a>
                <a href="face_mask" className="px-3 py-2 rounded bg-sky-500 text-white">マスク画像</a>
            </div>
        </div>
    )
}
