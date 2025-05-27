import { Todo } from "@/app/interfaces/Todo";

/**
 * TODOの初期化関数
 * @param text 
 * @returns Todo
 */
export function initTodo(text: string): Todo {
    return {
        id: Date.now(),
        text: text.trim(),
        done: false,
    };
}

/**
 * TODOリスト取得APIにGETする関数
 * @returns Todo[] | []
 */
export async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch('/api/todo/list');
    const data = await res.json();
    return data.todos || [];
}

/**
 * TODO追加APIにPOSTする関数
 * /api/todo/add
 * @param text 
 * @returns Todo | null
 */
export async function addTodo(text: string): Promise<Todo | null> {
    const res = await fetch('/api/todo/add', {
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

/**
 * TODO削除APIにPOSTする関数
 * /api/todo/remove
 * @param id 
 * @returns boolean
 */
export async function removeTodo(id: number): Promise<boolean> {
    const res = await fetch('/api/todo/remove', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    return res.ok;
}

/**
 * Todo完了APIにPOSTする関数
 * @param id 
 * @returns boolean
 */
export async function toggleTodo(id: number): Promise<boolean> {
    const res = await fetch("/api/todo/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    return res.ok;
}