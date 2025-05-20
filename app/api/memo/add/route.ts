import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // JSONデータの取得
    const { text } = await req.json();

    // レスポンスデータの作成
    const result = {
        message: "メモを追加しました",
        memo: text,
    };
    // レスポンス
    return NextResponse.json(result);
}