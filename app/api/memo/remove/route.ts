import { removeMemo } from "@/app/repositories/MemoRepository";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // メモ index 取得
    const { index } = await req.json();
    console.log("index:", index);

    // MemoRepository.removeMemo() で、メモを削除
    removeMemo(index);

    // レスポンスデータの作成
    const result = {
        message: "メモを削除しました",
    };
    // レスポンス
    return NextResponse.json(result);
}