"use client"

import { useState } from "react";
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { Todo } from "@/interfaces/Todo";

export default function Page() {
    const [todos, setTodos] = useState<Todo[]>([]);

    //TODO追加
    const add = (todo: Todo) => {
        // todosにデータを追加
        setTodos((prev) => [...prev, todo]);
    };

    // TODO削除
    const remove = function (id: number) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }

    // TODO完了済み
    const toggle = function (id: number) {
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : t))
        );
    };

    return (
        <section className="shadow rounded-2xl p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4">To‑Do</h2>
            <TodoForm addHandler={add} />
            <TodoList
                todos={todos}
                toggleHandler={toggle}
                removeHandler={remove} />
        </section>
    )
}