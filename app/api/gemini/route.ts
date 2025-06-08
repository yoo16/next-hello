import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const API_KEY = process.env.GEMINI_API_KEY;

    // GoogleGenAIインスタンス生成
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // JSONデータを取得してオブジェクトに変換
    const body = await req.json();
    // プロンプト内容
    const prompt = "つぎの質問を単語で答えて\n\n" + body.text;
    const contents = [
        {
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];
    // GeminiAPIにリクエスト
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        config: { responseMimeType: 'text/plain' },
        contents,
    });
    // レスポンスからテキストを取得
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return NextResponse.json({ message: text });
}