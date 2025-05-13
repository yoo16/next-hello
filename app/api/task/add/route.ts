import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { initTodo } from "@/app/services/todoService";

// dataディレクトリのパス
const DATA_DIR = join(process.cwd(), "data");
// todos.jsonのパス
const FILE_PATH = join(DATA_DIR, "todos.json");

export async function POST(req: Request) {
    try {
        // リクエストボディの取得
        const body = await req.json();

        if (!body || !body.text) {
            // リクエストボディが不正な場合
            return NextResponse.json({ error: "Invalid TODO data" }, { status: 400 });
        }

        if (!existsSync(DATA_DIR)) {
            // dataディレクトリの作成
            await mkdir(DATA_DIR, { recursive: true });
        }

        // 既存のJSON読み込み（なければ空配列）
        let todos = [];
        try {
            // JSONファイルの読み込み
            const fileData = await readFile(FILE_PATH, "utf8");
            todos = JSON.parse(fileData);
        } catch {
            todos = [];
        }

        // 新しいTODO 追加
        const todo = initTodo(body.text);
        todos.push(todo);

        // JSONとして保存
        await writeFile(FILE_PATH, JSON.stringify(todos, null, 2), "utf8");

        return NextResponse.json({ message: "Todo saved", todo: todo });
    } catch (error) {
        console.error("保存エラー:", error);
        return NextResponse.json({ error: "Failed to save todo" }, { status: 500 });
    }
}