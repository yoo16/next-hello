import { NextResponse } from "next/server";
import { getAllMemos } from "@/app/repositories/MemoRepository";

export async function GET() {
    // メモのダミーデータ
    // const memos = [ "Memo1", "Memo2", "Memo3", ];
    const memos = await getAllMemos();
    const message = "メモの一覧を取得しました";

    // レスポンスデータの作成
    const result = { memos, message };
    // レスポンス
    return NextResponse.json(result);
}