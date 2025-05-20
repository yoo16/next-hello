import { NextResponse } from "next/server";
import { addMemo } from "@/app/repositories/MemoRepository"; // ← App Router 外なら lib/ に移動推奨

export async function POST(req: Request) {
    // JSONリクエストの解析
    const { text } = await req.json();

    // メモ追加
    await addMemo(text);

    const result = {
        message: "メモを追加しました",
        memo: text,
    }
    return NextResponse.json(result);
}
