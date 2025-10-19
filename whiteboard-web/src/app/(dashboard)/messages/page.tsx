import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/auth-options";
import { MessagesClient } from "@/components/messages/messages-client";
import { getConversations } from "@/actions/messages";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/signin");
  }

  const conversationsResult = await getConversations();
  const conversations = conversationsResult.success && conversationsResult.data 
    ? conversationsResult.data 
    : [];

  return <MessagesClient initialConversations={conversations} currentUserId={session.user.id} />;
}
