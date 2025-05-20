import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const FILE_PATH = join(DATA_DIR, "memos.json");

export class MemoRepository {
    // データファイルの準備
    private static async ensureFile() {
        if (!existsSync(DATA_DIR)) {
            await mkdir(DATA_DIR, { recursive: true });
        }
        if (!existsSync(FILE_PATH)) {
            await writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
        }
    }

    // メモ一覧取得
    static async getAll(): Promise<string[]> {
        await this.ensureFile();
        const json = await readFile(FILE_PATH, "utf8");
        return JSON.parse(json);
    }

    // メモ追加
    static async add(text: string): Promise<void> {
        if (!text || typeof text !== "string") {
            throw new Error("Invalid memo text");
        }
        const memos = await this.getAll();
        memos.push(text);
        await writeFile(FILE_PATH, JSON.stringify(memos, null, 2), "utf8");
    }

    // メモ削除（index指定）
    static async remove(index: number): Promise<void> {
        const memos = await this.getAll();
        if (index < 0 || index >= memos.length) {
            throw new Error("Invalid index");
        }
        memos.splice(index, 1);
        await writeFile(FILE_PATH, JSON.stringify(memos, null, 2), "utf8");
    }

    // 全削除（任意）
    static async clear(): Promise<void> {
        await writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
    }
}
