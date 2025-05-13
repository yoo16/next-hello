// app/api/todo/add/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs"; // Node.js runtimeを使用

const DATA_DIR = join(process.cwd(), "data");
const FILE_PATH = join(DATA_DIR, "todos.json");

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body || !body.text || typeof body.text !== "string") {
            return NextResponse.json({ error: "Invalid TODO data" }, { status: 400 });
        }

        // 新しいTODO
        const newTodo = {
            id: Date.now(),
            text: body.text.trim(),
            done: false,
        };

        // data フォルダが存在しなければ作成
        if (!existsSync(DATA_DIR)) {
            await mkdir(DATA_DIR, { recursive: true });
        }

        // 既存のJSON読み込み（なければ空配列）
        let todos = [];
        try {
            const fileData = await readFile(FILE_PATH, "utf8");
            todos = JSON.parse(fileData);
        } catch {
            todos = [];
        }

        todos.push(newTodo);

        // JSONとして保存
        await writeFile(FILE_PATH, JSON.stringify(todos, null, 2), "utf8");

        return NextResponse.json({ message: "Todo saved", todo: newTodo });
    } catch (error) {
        console.error("保存エラー:", error);
        return NextResponse.json({ error: "Failed to save todo" }, { status: 500 });
    }
}
