"use client";

import { Todo } from "@/interfaces/Todo";
interface props {
    todos: Todo[];
    toggleHandler: (id: number) => void;
    removeHandler: (id: number) => void;
}

export default function TodoList({ todos, toggleHandler, removeHandler }: props) {

    return (
        <div>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2"
                    >
                        <span
                            onClick={() => toggleHandler(todo.id)}
                            className={
                                `flex-1 cursor-pointer select-none 
                                ${todo.done ? "line-through text-gray-400" : ""}`
                            }
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => removeHandler(todo.id)} className="ml-4">
                            ❌
                        </button>
                    </li>
                ))}
                {todos.length === 0 && (
                    <li className="text-center text-gray-400">No tasks yet 🎉</li>
                )}
            </ul>
        </div>
    );
}
