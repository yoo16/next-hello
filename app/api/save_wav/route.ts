import { LiveServerMessage } from '@google/genai';
import { convertToWav, saveBinaryFile } from '@/app/utils/AudioUtils';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { fileName, base64Data } = await req.json();
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(`./public/${fileName}`, buffer);
    return NextResponse.json({ status: 'ok' });
}

const audioParts: string[] = [];

export async function handleTurn(queue: LiveServerMessage[]) {
    let done = false;
    while (!done) {
        const message = await waitMessage(queue);
        if (message.serverContent?.turnComplete) {
            done = true;
        }
    }
}

export async function waitMessage(queue: LiveServerMessage[]): Promise<LiveServerMessage> {
    while (true) {
        const message = queue.shift();
        if (message) {
            handleModelTurn(message);
            return message;
        }
        await new Promise((r) => setTimeout(r, 100));
    }
}

export function handleModelTurn(message: LiveServerMessage) {
    const part = message.serverContent?.modelTurn?.parts?.[0];
    if (!part) return;

    if (part.text) {
        console.log(part.text);
    }

    if (part.inlineData?.data) {
        audioParts.push(part.inlineData.data);
        const buffer = convertToWav(audioParts, part.inlineData.mimeType || 'audio/wav');
        saveBinaryFile('audio.wav', buffer);
    }
}