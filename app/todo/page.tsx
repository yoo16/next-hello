"use client";

import { FormEvent, useEffect, useState } from "react";
import { Todo } from "@/app/interfaces/Todo";
import { initTodo, fetchTodos, addTodo, removeTodo, toggleTodo } from "@/app/services/todoService";

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState("");

    // 初回レンダリング時にTODOリストを取得
    useEffect(() => {
        const load = async () => {
            const data = await fetchTodos();
            setTodos(data);
        };
        load();
    }, []);

    /**
     * Todoを追加する関数
     * @param e 
     * @returns 
     */
    const add = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        // 新規Todoを作成
        const todo: Todo = initTodo(text);
        // Todoをローカルの状態に追加
        setTodos((prev) => [...prev, todo]);
        // textを空にする
        setText("");

        // 追加したTODOをAPIに保存
        const saved = await addTodo(todo.text);
        if (!saved) console.error("保存に失敗しました");
    };

    /**
     * Todoを削除する関数
     * @param id 
     */
    const remove = async (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        // 削除したTODOをAPIに保存
        const ok = await removeTodo(id);
        if (!ok) console.error("削除に失敗しました");
    };

    /**
     * Todoの完了状態を切り替える関数
     * @param id 
     */
    const toggle = async (id: number) => {
        // ローカルの状態を先に変更（楽観的更新）
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            )
        );

        // Todoの完了状態をAPIに保存
        const ok = await toggleTodo(id);
        if (!ok) {
            console.error("状態更新に失敗しました");
            // 必要ならロールバック処理も追加可能
        }
    };

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
                        <li className="text-center text-gray-400">タスクがありません</li>
                    )}
                </ul>
            </section>
        </div>
    );
}
