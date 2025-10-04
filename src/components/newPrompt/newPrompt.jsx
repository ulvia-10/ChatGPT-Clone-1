import { useState } from "react";
import "./newPrompt.css";
import { useSubmitMessagerData } from "../../hooks/use-submit-data-messager";
import { useQueryClient } from "@tanstack/react-query";


const NewPrompt = ({ setMessages }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const mutationMessage = useSubmitMessagerData();
  const queryClient = useQueryClient();
  const {userId} = JSON.parse(localStorage.getItem("USER"));

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
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["conversation", userId] });
        }
      }
    );

    setInput("");
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser tidak mendukung Speech Recognition");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

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
        style={{ marginRight: 8 }}
      />
      <button
        type="button"
        onClick={handleMicClick}
        style={{ background: isRecording ? '#fbbf24' : '#605e68', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 10, marginRight: 8 }}
        title={isRecording ? "Merekam..." : "Rekam suara"}
        disabled={isRecording}
      >
        {isRecording ? '🎤...' : '🎤'}
      </button>
      <button type="submit" disabled={!input.trim() || mutationMessage.isPending}>
        {mutationMessage.isPending ? "..." : <img src="/arrow.png" alt="send" />}
      </button>
    </form>
  );
};

export default NewPrompt;
