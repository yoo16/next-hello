import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs"; // Edge Runtimeではファイル操作できない

const FILE_PATH = join(process.cwd(), "data", "todos.json");

export async function GET() {
    try {
        if (!existsSync(FILE_PATH)) {
            return NextResponse.json({ todos: [] }); // ファイルがなければ空配列を返す
        }

        const data = await readFile(FILE_PATH, "utf8");
        const todos = JSON.parse(data);

        return NextResponse.json({ todos });
    } catch (error) {
        console.error("読み込みエラー:", error);
        return NextResponse.json({ error: "Failed to load todos" }, { status: 500 });
    }
}