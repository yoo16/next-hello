import { Todo } from "@/interfaces/Todo";

const API_BASE = "/api/todo";

export function initTodo(text: string): Todo {
    return {
        id: Date.now(),
        text: text.trim(),
        done: false,
    };
}

export async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_BASE}/list`);
    const data = await res.json();
    return data.todos || [];
}

export async function addTodo(text: string): Promise<Todo | null> {
    const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        console.error("Add failed");
        return null;
    }

    const data = await res.json();
    return data.todo;
}

export async function removeTodo(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });

    return res.ok;
}
