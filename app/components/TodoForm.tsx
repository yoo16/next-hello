"use client";

import { Todo } from "@/interfaces/Todo";
import { FormEvent, useState } from "react";

interface props {
    addTodo: (todo: Todo) => void;
}

export default function TodoForm({ addTodo }: props) {
    const [text, setText] = useState("");

    const addHandler = (e: FormEvent) => {
        // イベントをこれ以上うけつけない
        e.preventDefault();

        // 入力テキストをトリムして空欄だったら終了
        if (!text.trim()) return;

        // 新しいTODO
        const newTodo: Todo = {
            id: Date.now(),
            text: text.trim(),
            done: false
        };
        console.log(newTodo);

        // 入力テキストをトリムして空欄だったら終了
        // addTodo(newTodo)

        // 入力テキストを削除
        setText("");
    };

    return (
        <div>
            <form className="flex gap-2 mb-6">
                <input
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    placeholder="Add task…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    onClick={addHandler}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl">Add</button>
            </form>
        </div>
    )
}
