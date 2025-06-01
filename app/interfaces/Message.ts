import type { Role } from '@/app/constants/roles';

export interface Message {
    content: string;
    role?: Role;
}