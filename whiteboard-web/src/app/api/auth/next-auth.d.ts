import { User } from '@/lib/types/user.type';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        error?: string;
    }
}

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        error?: string;
    }
}
