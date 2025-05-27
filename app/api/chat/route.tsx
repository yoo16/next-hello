import { NextRequest, NextResponse } from 'next/server';
import { sendToGemini } from '@/app/services/GeminiService';

export async function POST(req: NextRequest) {
    try {
        const message = await req.json();
        if (!message) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        // const botMessage: Message = { content: "Botのメッセージ", role: 'bot' };
        const botMessage = await sendToGemini(message);
        return NextResponse.json({ message: botMessage });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
