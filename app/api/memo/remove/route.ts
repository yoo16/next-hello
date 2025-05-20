import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // JSONデータの取得
    const { text } = await req.json();
    console.log("text", text);

    // レスポンスデータの作成
    const result = {
        message: "メモを削除しました",
    };
    // レスポンス
    return NextResponse.json(result);
}