import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs"; // Edgeではfs使えない

const DATA_DIR = join(process.cwd(), "data");
const FILE_PATH = join(DATA_DIR, "memos.json");

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        if (!existsSync(DATA_DIR)) {
            await mkdir(DATA_DIR, { recursive: true });
        }

        let memos: string[] = [];
        try {
            const file = await readFile(FILE_PATH, "utf8");
            memos = JSON.parse(file);
        } catch {
            memos = [];
        }

        memos.push(text);

        await writeFile(FILE_PATH, JSON.stringify(memos, null, 2), "utf8");

        return NextResponse.json({ message: "Memo saved", text });
    } catch (err) {
        console.error("保存エラー:", err);
        return NextResponse.json({ error: "Failed to save memo" }, { status: 500 });
    }
}
