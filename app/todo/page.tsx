"use client"

import { FormEvent, useEffect, useState } from "react";
import { Todo } from "@/interfaces/Todo";

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState("");

    // useEffectで初回マウント時にTODOを取得
    useEffect(() => {
        const fetchTodos = async () => {
            const res = await fetch("/api/todo/list");
            const data = await res.json();
            setTodos(data.todos);
        };
        fetchTodos();
    }, []);

    //TODO追加
    const add = async (e: FormEvent) => {
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

        // todosにデータを追加
        setTodos((prev) => [...prev, newTodo]);

        // サーバにPOST
        try {
            const res = await fetch("/api/todo/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: newTodo.text }),
            });

            const data = await res.json();
            console.log("保存結果:", data);
        } catch (err) {
            console.error("保存に失敗しました:", err);
        }

        // 入力テキストを削除
        setText("");
    };

    // TODO削除
    const remove = async (id: number) => {
        console.log(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        try {
            const res = await fetch("/api/todo/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            console.log("削除結果:", data);
        } catch (err) {
            console.error("削除に失敗しました:", err);
        }
    };


    // TODO完了済み
    const toggle = (id: number) => {
        console.log(id)
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
        );
    };

    return (
        <div className="rounded-2xl p-6 w-1/2 mx-auto bg-white">
            <h2 className="text-center text-2xl font-semibold mb-4">To‑Do</h2>
            {/* フォーム */}
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

            {/* TODOリスト */}
            <section>
                <ul className="space-y-2">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className="flex items-center justify-between border-b border-gray-200 px-3 py-2"
                        >
                            <span
                                onClick={() => toggle(todo.id)}
                                className={
                                    `flex-1 cursor-pointer select-none 
                                ${todo.done ? "line-through text-gray-400" : ""}`
                                }
                            >
                                {todo.text}
                            </span>
                            <button onClick={() => remove(todo.id)} className="ml-4 cursor-pointer">
                                ❌
                            </button>
                        </li>
                    ))}
                    {todos.length === 0 && (
                        <li className="text-center text-gray-400">No tasks yet 🎉</li>
                    )}
                </ul>
            </section>
        </div>
    )
}