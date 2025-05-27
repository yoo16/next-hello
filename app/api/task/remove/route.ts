import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Todo } from "@/app/interfaces/Todo";

export const runtime = "nodejs"; // ファイル操作のため

const FILE_PATH = join(process.cwd(), "data", "todos.json");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        // idが存在しない、または数値でない場合エラー
        if (typeof id !== "number") {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // TODOリストを読み込む
        const data = await readFile(FILE_PATH, "utf8");
        // JSON.parseでパース
        const todos = JSON.parse(data);
        // IDに一致するTODOを削除
        const newTodos = todos.filter((todo: Todo) => todo.id !== id);
        // 新しいTODOリストをJSONとして保存
        await writeFile(FILE_PATH, JSON.stringify(newTodos, null, 2), "utf8");

        return NextResponse.json({ message: "Todo deleted", id });
    } catch (error) {
        console.error("削除エラー:", error);
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }
}
