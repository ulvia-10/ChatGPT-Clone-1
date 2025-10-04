import { useQuery } from "@tanstack/react-query";

async function fetchConversationByUserId(userId) {
  const res = await fetch(
    `https://chat-chatcuek.satrya.dev/api/conversations?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return res.json();
}

export function useGetConversationByUserId(userId) {
  return useQuery({
    queryKey: ["conversation", userId],
    queryFn: () => fetchConversationByUserId(userId),
    enabled: !!userId,
    staleTime: 0,
  });
}
