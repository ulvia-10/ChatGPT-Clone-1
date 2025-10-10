/* eslint-disable no-constant-condition */
import { useMutation } from "@tanstack/react-query";

const postMessage = async ({ data, onChunk }) => {
  // conversationId, message, model, userId sudah harus dikirim dari data
  const response = await fetch("https://chat-chatcuek.satrya.dev/api/chat/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: data.conversationId,
      message: data.messages,
      model: data.model,
      userId: data.userId
    }),
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

        if (token) onChunk(token);
      } catch (e) {
        onChunk(raw);
      }
    }
  }
};

export const useSubmitMessagerData = () => {
  return useMutation({
    mutationFn: ({ data, onChunk, model }) =>
      postMessage({ data, onChunk, model }),
  });
};
