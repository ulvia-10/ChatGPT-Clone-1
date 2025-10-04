import { useState } from "react";
import "./newPrompt.css";
import { useSubmitMessagerData } from "../../hooks/use-submit-data-messager";


const NewPrompt = ({ setMessages }) => {
  const [input, setInput] = useState("");
  const mutationMessage = useSubmitMessagerData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    let aiReply = "";
    mutationMessage.mutate(
      {
        data: { message: input },
        onChunk: (token) => {
          aiReply += token;

          setMessages((prev) => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];

            if (lastMsg?.role === "assistant") {
              newMsgs[newMsgs.length - 1] = {
                ...lastMsg,
                content: aiReply,
              };
            }
            return newMsgs;
          });
        },
      },
      {
        onError: (err) => console.error("Error:", err),
      }
    );

    setInput("");
  };

  return (
    <form className="newForm" onSubmit={handleSubmit}>
      <label htmlFor="file">
        <img src="/attachment.png" alt="attach" />
      </label>
      <input id="file" type="file" hidden />

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <button type="submit" disabled={!input.trim() || mutationMessage.isPending}>
        {mutationMessage.isPending ? "..." : <img src="/arrow.png" alt="send" />}
      </button>
    </form>
  );
};

export default NewPrompt;
