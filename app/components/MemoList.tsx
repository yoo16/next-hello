"use client";

// reactの useState, FormEvent をインポート
import { useState, FormEvent } from "react";
import { addMemo } from "../services/memoService";

export default function MemoList() {
    // textの値を管理するステート変数
    const [text, setText] = useState("");
    // memosの値を管理するステート変数
    const [memos, setMemos] = useState<string[]>([]);

    // textの変更を監視するイベントハンドラ
    const handleTextChange = (e: FormEvent<HTMLInputElement>) => {
        // textの値を更新する
        setText(e.currentTarget.value);
        // console.log(text);
    };

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        // サーバにメモを追加するリクエストを送信
        const ok = await addMemo(text.trim());
        if (ok) {
            // クライアント側のメモリストに追加
            setMemos((prev) => [...prev, text.trim()]);
            setText("");
        } else {
            console.error("メモの保存に失敗しました");
        }
    };

    return (
        <section className="mx-auto p-6 rounded shadow">
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="メモを追加"
                    className="flex-1 border border-gray-300 px-3 py-2 rounded"
                />
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    追加
                </button>
            </div>

            <ul className="space-y-2">
                {memos.length === 0 && (
                    <li className="text-gray-400 text-center">メモはまだありません</li>
                )}
                {memos.map((memo, key) => (
                    <li
                        key={key}
                        className="border-b pb-1 border-gray-300 text-gray-800">
                        {memo}
                    </li>
                ))}
            </ul>
        </section>
    );
}
