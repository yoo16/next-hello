import { writeFile } from 'fs';

export interface WavOptions {
    numChannels: number;
    sampleRate: number;
    bitsPerSample: number;
}

export function convertToWav(rawData: string[], mimeType: string): Buffer {
    const options = parseMimeType(mimeType);
    const dataLength = rawData.reduce((sum, d) => sum + d.length, 0);
    const header = createWavHeader(dataLength, options);
    const buffer = Buffer.concat(rawData.map(b => Buffer.from(b, 'base64')));
    return Buffer.concat([header, buffer]);
}

export function parseMimeType(mimeType: string): WavOptions {
    const options: WavOptions = {
        numChannels: 1,
        sampleRate: 24000,
        bitsPerSample: 16,
    };

    const params = mimeType.split(';').map(s => s.trim());
    for (const param of params) {
        const [key, value] = param.split('=');
        if (key === 'rate') options.sampleRate = parseInt(value, 10);
    }

    return options;
}

export function createWavHeader(dataLength: number, opt: WavOptions): Buffer {
    const { numChannels, sampleRate, bitsPerSample } = opt;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataLength, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataLength, 40);

    return buffer;
}

export function saveBinaryFile(fileName: string, content: Buffer) {
    writeFile(fileName, content, 'utf8', (err) => {
        if (err) console.error(`Error writing ${fileName}:`, err);
        else console.log(`Saved: ${fileName}`);
    });
}
