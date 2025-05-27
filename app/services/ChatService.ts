// src/services/ChatService.ts
import { Message } from '@/app/interfaces/Message';

export async function sendMessageToAPI(message: Message): Promise<Message> {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
    });

    if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
    }

    const data = await res.json();
    // サーバー側の返り値が { message: Message } なら
    return data.message as Message;
}
