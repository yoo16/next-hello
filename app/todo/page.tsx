"use client";

import { FormEvent, useEffect, useState } from "react";
import { Todo } from "@/interfaces/Todo";
import { initTodo, fetchTodos, addTodo, removeTodo } from "@/app/services/todoService";

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const load = async () => {
            const data = await fetchTodos();
            setTodos(data);
        };
        load();
    }, []);

    const add = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        const todo:Todo = initTodo(text);
        setTodos((prev) => [...prev, todo]);
        setText("");

        const saved = await addTodo(todo.text);
        if (!saved) console.error("保存に失敗しました");
    };

    const remove = async (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        const ok = await removeTodo(id);
        if (!ok) console.error("削除に失敗しました");
    };

    const toggle = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            )
        );
    };

    // JSX（変わらず）
    return (
        <div className="rounded-2xl p-6 w-1/2 mx-auto bg-white">
            <h2 className="text-center text-2xl font-semibold mb-4">To‑Do</h2>
            <section>
                <form className="flex gap-2 mb-6">
                    <input
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        placeholder="Add task…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button
                        onClick={add}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl">Add</button>
                </form>
            </section>
            <section>
                <ul className="space-y-2">
                    {todos.map((todo) => (
                        <li key={todo.id} className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
                            <span
                                onClick={() => toggle(todo.id)}
                                className={`flex-1 cursor-pointer select-none ${todo.done ? "line-through text-gray-400" : ""}`}
                            >
                                {todo.text}
                            </span>
                            <button onClick={() => remove(todo.id)} className="ml-4 cursor-pointer">❌</button>
                        </li>
                    ))}
                    {todos.length === 0 && (
                        <li className="text-center text-gray-400">No tasks yet 🎉</li>
                    )}
                </ul>
            </section>
        </div>
    );
}
