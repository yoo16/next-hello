'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/app/interfaces/Message';
import { sendMessageToAPI } from '@/app/services/ChatService';
import MessageItem from '@/app/components/MessageItem';
import { ROLE_USER } from '@/app/constants/roles';

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message>({ role: ROLE_USER, content: '' });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage({ role: ROLE_USER, content: e.target.value });
    };

    const handleSubmit = async () => {
        if (!message.content) return;
        setMessages(prev => [...prev, message]);
        setMessage({ role: ROLE_USER, content: '' });

        const botMessage = await sendMessageToAPI(message);
        if (botMessage) {
            setMessages(prev => [...prev, botMessage]);
        }
    };

    return (
        <div className="container mx-auto flex flex-col h-screen">
            <h1 className="text-3xl font-bold text-center">Chat</h1>
            <div className="flex shadow-md p-4 z-10">
                <input
                    onChange={handleChangeText}
                    type="text"
                    className="border border-gray-300 rounded p-3 w-full"
                    value={message.content}
                    placeholder="ここにメッセージを入力してください"
                />
                <button onClick={handleSubmit} className="bg-sky-600 text-white p-2 w-20 rounded">
                    Send
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {messages.map((message, i) => (
                    <MessageItem key={i} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
