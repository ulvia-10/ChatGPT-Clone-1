import { useState, useRef, useEffect } from "react";
import NewPrompt from "../../components/newPrompt/newPrompt";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useGetConversationHistory } from "../../hooks/use-get-historical-conversation";
import { useSubmitMessagerData } from "../../hooks/use-submit-data-messager";
import { useUser } from "@clerk/clerk-react";

const ChatPage = () => {
  const endRef = useRef(null);
  const {user} = useUser()
  const userId = user?.id;
  const mutation = useSubmitMessagerData(userId);
  const {id} = useParams()

  const {data: conversationList} = useGetConversationHistory(id);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (conversationList && Array.isArray(conversationList.messages)) {
      setMessages(conversationList.messages);
    }
  }, [conversationList]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (userText) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "_berpikir sejenak..._", loading: true },
    ]);

    mutation.mutate({
      data: { model: "gpt-3.5-turbo", messages: [{ role: "user", content: userText }] },
      onChunk: (token) => {
        if (token === "[DONE]") return;

        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === "assistant") {
            if (lastMsg.content === "_berpikir sejenak..._" || lastMsg.loading) {
              lastMsg.content = token;
              delete lastMsg.loading;
            } else {
              lastMsg.content += token;
            }
            newMsgs[newMsgs.length - 1] = { ...lastMsg };
          }
          return newMsgs;
        });
      },
    });
  };

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.role === "user" ? "user" : "ai"}${msg.loading ? " bling" : ""}`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        <NewPrompt onSend={handleSend} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ChatPage;
