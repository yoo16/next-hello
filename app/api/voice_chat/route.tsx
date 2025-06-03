import { NextRequest, NextResponse } from 'next/server';
import { ROLE_BOT } from '@/app/constants/roles';
import { sendToGemini } from '@/app/services/GeminiService';
import { Message } from '@/app/interfaces/Message';

export async function POST(req: NextRequest) {
    try {
        const text = await req.json();
        if (!text) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        const botMessage = await sendToGemini(text);
        const message:Message = {
            content: botMessage,
            role: ROLE_BOT,
        };
        return NextResponse.json({ message });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
