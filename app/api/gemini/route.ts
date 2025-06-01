import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    // APIキー
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return;

    // GoogleGenerativeAIインスタンス
    const genAI = new GoogleGenerativeAI(API_KEY);
    // モデル
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // 最大トークン
    model.generationConfig.maxOutputTokens = 2048;

    // プロンプト
    const prompt = "Geminiは何食べたい？";
    // Gemini API にリクエスト（コンテンツ作成）
    const result = await model.generateContent(prompt);
    // レスポンスからテキストデータを取得
    const text = result.response.text();
    // レスポンスデータ生成
    const data = { message: text };
    // レスポンス
    return NextResponse.json(data);
}