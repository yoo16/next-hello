export interface Message {
    content: string;
    role?: 'user' | 'bot';
    lang?: string;
}