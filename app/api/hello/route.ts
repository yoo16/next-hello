import { NextResponse } from 'next/server';

export async function GET() {
    const data = { 
        message: "こんにちは、API!" 
    };
    return NextResponse.json(data);
}