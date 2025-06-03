import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function GET() {
    const API_KEY = process.env.GEMINI_API_KEY;

    // プロンプト内容
    const prompt = 'Geminiは何食べたい？';

    // GoogleGenAIインスタンス生成
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-2.0-flash';
    const config = {
        responseMimeType: 'text/plain',
    };
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];
    // GeminiAPIにリクエストを送信
    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });
    // レスポンスからテキストを取得
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return NextResponse.json({ message: text });
}