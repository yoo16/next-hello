import { NextRequest, NextResponse } from 'next/server';
import { ROLE_BOT } from '@/app/constants/roles';
// import { sendToGemini } from '@/app/services/GeminiService';

export async function POST(req: NextRequest) {
    const message = await req.json();
    if (!message) return NextResponse.json({ error: "Not found message" });
    console.log('Received message:', message);
    const botMessage = "Botのメッセージ";
    return NextResponse.json({ content: botMessage, role: ROLE_BOT });
}

// export async function POST(req: NextRequest) {
//     try {
//         const message = await req.json();
//         if (!message) {
//             return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
//         }
//         const botMessage = await sendToGemini(message);
//         return NextResponse.json({ message: botMessage });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }
