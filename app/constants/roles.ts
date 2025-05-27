export const ROLE_USER = 'user' as const;
export const ROLE_BOT = 'bot' as const;
export type Role = typeof ROLE_USER | typeof ROLE_BOT;

// それぞれの role に対する表示ラベルとスタイルをまとめる
export const roleConfig: Record<
    Role,
    { label: string; bubbleClass: string; tagClass: string }
> = {
    [ROLE_USER]: {
        label: 'あなた',
        bubbleClass: 'bg-blue-100 text-blue-800',
        tagClass: 'bg-blue-600',
    },
    [ROLE_BOT]: {
        label: 'Bot',
        bubbleClass: 'bg-gray-100 text-gray-800',
        tagClass: 'bg-gray-600',
    },
};
