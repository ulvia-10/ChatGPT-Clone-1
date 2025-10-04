import { useQuery } from "@tanstack/react-query";

async function fetchConversationByUserId(conversationId) {
  const res = await fetch(`https://chat-chatcuek.satrya.dev/api/conversations/${conversationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return res.json();
}

export function useGetConversationHistory(conversationId) {
  return useQuery({
    queryKey: ["conversation-history", conversationId], 
    queryFn: () => fetchConversationByUserId(conversationId),
    enabled: !!conversationId, 
  });
}
