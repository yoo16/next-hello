'use client';

import { Message } from '@/app/interfaces/Message';
import { roleConfig } from '@/app/constants/roles';

interface Props {
    message: Message;
}

export default function MessageItem({ message }: Props) {
    const role = message.role || 'bot';
    const { label, bubbleClass, tagClass } = roleConfig[role];

    return (
        <div className={`m-3 p-5 rounded-lg shadow-md ${bubbleClass}`}>
            <span
                className={`inline-block mb-2 me-3 px-3 py-1
                            rounded-full text-white text-sm font-semibold
                            ${tagClass}
                            `}>
                {label}
            </span>
            <span>{message.content}</span>
        </div>
    );
}