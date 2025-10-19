import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// Add buffer time (5 minutes) before token expiry for refresh
const REFRESH_TOKEN_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await axios.post(`${process.env.SERVER_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data;

          if (!data.success) {
            throw new Error(data.error?.message || 'Authentication failed');
          }

          // Return user data with tokens
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: `${data.data.user.firstName} ${data.data.user.lastName}`,
            image: data.data.user.avatar || null,
            role: data.data.user.role,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          } as any;
        } catch (error: any) {
          throw new Error(error.response?.data?.error?.message || error.message || 'Authentication failed');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // If this is a new login, store the user data and tokens
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: (user as any).role,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresIn: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session,
        };
      }

      // Check if token needs refresh (with buffer time)
      const shouldRefresh =
        token.expiresIn &&
        Date.now() > (token.expiresIn as number) - REFRESH_TOKEN_BUFFER;

      if (!shouldRefresh) {
        return token;
      }

      // Attempt to refresh the token
      if (!token.refreshToken) {
        return token; // Can't refresh without refresh token
      }

      try {
        const response = await axios.post(`${process.env.SERVER_URL}/auth/refresh`, {
          refreshToken: token.refreshToken as string,
        });

        const data = response.data;

        if (!data.success || !data.data) {
          return token; // Return old token if refresh fails
        }

        // Return updated token with new access token
        return {
          ...token,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: Date.now() + 15 * 60 * 1000,
        };
      } catch {
        return token; // Return old token if refresh fails
      }
    },

    async session({ session, token }) {
      // Add token data to session
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          image: token.image as string | null,
          role: token.role as string,
        } as any;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
      }

      return session;
    },
  },

  pages: {
    signIn: '/signin',
    signOut: '/sign-out',
    error: '/signin',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
