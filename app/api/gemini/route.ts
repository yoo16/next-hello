import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function GET() {
    const API_KEY = process.env.GEMINI_API_KEY;

    // GoogleGenAIインスタンス生成
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // プロンプト内容
    const prompt = 'Geminiは何食べたい？';
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