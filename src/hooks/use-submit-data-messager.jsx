import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

const postMessage = async ({ data, onChunk }) => {
  const newId = uuidv4();
  const userData = JSON.parse(localStorage.getItem("USER") || "{}");
  const userId = userData?.userId;

  const response = await fetch("https://chat-chatcuek.satrya.dev/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, stream: true, conversationId: newId, userId: userId }),
  });

  if (!response.body) throw new Error("ReadableStream not supported");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      onChunk("[DONE]");
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const raw = line.slice(5);
      if (!raw) continue;
      if (raw === "[DONE]") {
        onChunk("[DONE]");
        continue;
      }

      try {
        const json = JSON.parse(raw);
        const token = json?.choices?.[0]?.delta?.content ?? "";

        if (token) {
          onChunk(token);
        }
      } catch (e) {
        onChunk(raw);
      }
    }
  }
};

export const useSubmitMessagerData = () => {
  return useMutation({
    mutationFn: postMessage,
  });
};
