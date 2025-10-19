'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getConversationMessages, sendMessage } from '@/actions/messages';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  partner: User;
  lastMessage: Message;
  unreadCount: number;
}

interface MessagesClientProps {
  initialConversations: Conversation[];
  currentUserId: string;
}

export function MessagesClient({ initialConversations, currentUserId }: MessagesClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    initialConversations.length > 0 ? initialConversations[0] : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    `${conv.partner.firstName} ${conv.partner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedConversation) {
      void loadMessages(selectedConversation.partner.id);
    }
  }, [selectedConversation]);

  const loadMessages = async (partnerId: string) => {
    setIsLoading(true);
    const result = await getConversationMessages(partnerId);
    if (result.success && result.data) {
      setMessages(result.data);
    } else {
      console.error('Failed to load messages:', result.error);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const result = await sendMessage(selectedConversation.partner.id, messageInput.trim());
    
    if (result.success && result.data) {
      setMessages([...messages, result.data]);
      setMessageInput('');
    } else {
      console.error('Failed to send message:', result.error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    // Format as date
    return date.toLocaleDateString();
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Connect with instructors and classmates
        </p>
      </div>

      {/* Messages Container */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm ? 'No conversations found' : 'No messages yet'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.partner.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-accent/50 transition-colors",
                      selectedConversation?.partner.id === conversation.partner.id && "bg-accent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.partner.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(conversation.partner.firstName, conversation.partner.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm truncate">
                            {conversation.partner.firstName} {conversation.partner.lastName}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-5 min-w-[20px] px-1.5 bg-primary text-primary-foreground">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(conversation.lastMessage.sentAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        {selectedConversation ? (
          <Card className="flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.partner.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(selectedConversation.partner.firstName, selectedConversation.partner.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {selectedConversation.partner.firstName} {selectedConversation.partner.lastName}
                  </h2>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedConversation.partner.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === currentUserId ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        message.senderId === currentUserId
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderId === currentUserId
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatMessageTime(message.sentAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </Card>
        )}
      </div>
    </div>
  );
}
