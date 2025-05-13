"use client"

import { useState } from "react";
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import { Todo } from "@/interfaces/Todo";

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);

    //TODO追加
    const add = (todo: Todo) => {
        // todosにデータを追加
        console.log(todo)
        setTodos((prev) => [...prev, todo]);
    };

    // TODO削除
    const remove = (id: number) => {
        console.log(id)
        // setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }

    // TODO完了済み
    const toggle = (id: number) =>{
        console.log(id)
        // setTodos((prev) =>
        //     prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : t))
        // );
    };

    return (
        <section className="shadow rounded-2xl p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4">To‑Do</h2>
            <TodoForm addTodo={add} />

        </section>
    )
}