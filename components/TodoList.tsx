"use client";

import { FormEvent, useState } from "react";

type Todo = { id: number; text: string; done: boolean };

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState("");

    const addTodo = (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setTodos((prev) => [
            ...prev,
            { id: Date.now(), text: text.trim(), done: false },
        ]);
        setText("");
    };

    const toggle = (id: number) =>
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );

    const remove = (id: number) =>
        setTodos((prev) => prev.filter((t) => t.id !== id));

    return (
        <section className="bg-white shadow rounded-2xl p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4">To‑Do List</h2>

            {/* 入力フォーム */}
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
                <input
                    className="flex-1 border rounded-xl px-3 py-2"
                    placeholder="Add task…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                >
                    Add
                </button>
            </form>

            {/* 一覧表示 */}
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2"
                    >
                        <span
                            onClick={() => toggle(todo.id)}
                            className={`flex-1 cursor-pointer select-none ${todo.done ? "line-through text-gray-400" : ""
                                }`}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => remove(todo.id)} className="ml-4">
                            ❌
                        </button>
                    </li>
                ))}
                {todos.length === 0 && (
                    <li className="text-center text-gray-400">No tasks yet 🎉</li>
                )}
            </ul>
        </section>
    );
}
