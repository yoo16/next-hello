import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";


import { ROLE_BOT } from '@/app/constants/roles';
import { Message } from '@/app/interfaces/Message';
// import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.GEMINI_API_KEY;

const DATA_DIR = join(process.cwd(), "public/images");

// データファイルの準備
async function ensureFile() {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }
}

export async function sendToGemini(userMessage: Message): Promise<Message> {
    const prompt = `つぎの質問に答えて。\n\n${userMessage.content}`;

    // GoogleGenAIインスタンス生成
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const config = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
    };

    // コンテンツの設定
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
        model: "gemini-2.0-flash",
        config,
        contents
    });

    // レスポンスからテキストを取得
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return {
        role: ROLE_BOT,
        content: text,
    };
}

/**
 * 画像を Base64 に変換し、Gemini に送って内容を説明させる
 * @param imagePath - サーバ上の画像ファイルのパス（例: "./public/uploads/image.png"）
 */
export async function whatsImage(imageFile: File): Promise<string> {
    // 画像ファイルを Base64 に変換
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // プロンプト
    const prompt = "添付した画像について説明して。";
    // GoogleGenAIインスタンス生成
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const config = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
    };

    // コンテンツの設定
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    inlineData: {
                        mimeType: imageFile.type,
                        data: base64Image,
                    }
                },
                { text: prompt },
            ],
        }
    ];
    // GeminiAPIにリクエストを送信
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        config,
        contents
    });
    console.log(response.candidates?.[0]?.content?.parts);
    // レスポンスからテキストデータを取得
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return text;
}

export async function generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const config = {
        responseMimeType: 'image/jpeg', // または 'image/png'
    };
    // コンテンツの設定
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ]
    // GeminiAPIにリクエストを送信
    const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-preview-image-generation",
        config,
        contents
    });

    // ディレクトリチェック
    ensureFile();
    // TODO: ファイル名をUUIDで生成
    const fileExtension = ".jpg";
    const fileName = new Date() + fileExtension;
    const filePath = join(DATA_DIR, fileName);
    const url = `/images/${fileName}`;

    // レスポンスから画像データを取得
    for await (const chunk of response) {
        if (!chunk || !chunk.candidates?.[0].content || !chunk.candidates[0].content.parts) {
            continue;
        }
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        if (inlineData) {
            // バッファをBase64データから生成
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            // バッファをファイルに書き込む
            writeFile(filePath, buffer, 'utf8');
        } else {
            console.log(chunk.text);
        }
    }
    return url;
}
