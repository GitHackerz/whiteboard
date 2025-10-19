'use server';

import { handleRequest } from './utils/handleRequest';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  sender: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
  receiver: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
}

interface Conversation {
  partner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export async function getConversations() {
  return handleRequest<Conversation[]>('get', 'messages/conversations');
}

export async function getConversationMessages(partnerId: string) {
  return handleRequest<Message[]>('get', `messages/conversation/${partnerId}`);
}

export async function sendMessage(receiverId: string, content: string) {
  return handleRequest<Message>('post', 'messages', { receiverId, content });
}

export async function markMessageAsRead(messageId: string) {
  return handleRequest('patch', `messages/${messageId}/read`);
}

export async function deleteMessage(messageId: string) {
  return handleRequest('delete', `messages/${messageId}`);
}
