// lib/repositories/memoRepository.ts
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const FILE_PATH = join(DATA_DIR, "memos.json");

// データファイルの準備
async function ensureFile() {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }
    if (!existsSync(FILE_PATH)) {
        await writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
    }
}

// メモ一覧取得
export async function getAllMemos(): Promise<string[]> {
    await ensureFile();
    const json = await readFile(FILE_PATH, "utf8");
    return JSON.parse(json);
}

// メモ追加
export async function addMemo(text: string): Promise<void> {
    if (!text) return;
    const memos = await getAllMemos();
    memos.push(text);
    const json = JSON.stringify(memos, null, 2);
    await writeFile(FILE_PATH, json, "utf8");
}

// メモ削除（index指定）
export async function removeMemo(index: number): Promise<void> {
    const memos = await getAllMemos();
    if (index < 0 || index >= memos.length) return;
    memos.splice(index, 1);
    const json = JSON.stringify(memos, null, 2);
    await writeFile(FILE_PATH, json, "utf8");
}

// 全削除
export async function clearMemos(): Promise<void> {
    const json = await JSON.stringify([], null, 2);
    await writeFile(FILE_PATH, json, "utf8");
}