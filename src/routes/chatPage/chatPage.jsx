import { useState, useRef, useEffect } from "react";
import NewPrompt from "../../components/newPrompt/newPrompt";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./chatPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGetConversationHistory } from "../../hooks/use-get-historical-conversation";
import { useSubmitMessagerData } from "../../hooks/use-submit-data-messager";
import { useUser } from "@clerk/clerk-react";
import { useModels } from "./hook /use-model";
import { useQueryClient } from '@tanstack/react-query';

const ChatPage = () => {
  const endRef = useRef(null);
  const { user } = useUser();
  const userId = user?.id;
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState(id);
  useEffect(() => {
    if (!id) {
      const newId = uuidv4();
      setConversationId(newId);
      navigate(`/dashboard/chat/${newId}`, { replace: true });
    } else {
      setConversationId(id); // update conversationId setiap kali id berubah
    }
  }, [id, navigate]);

  const mutation = useSubmitMessagerData(userId);
  const { data: conversationList } = useGetConversationHistory(conversationId);
  const { models } = useModels();
  const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (conversationList?.messages) {
      setMessages(conversationList.messages);
    } else {
      setMessages([]);
    }
  }, [conversationList]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // handleSubmit akan dipanggil oleh NewPrompt
  const handleSend = (userText) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "_berpikir sejenak..._", loading: true },
    ]);
    const modelName = models?.[0]?.name || "default";
    mutation.mutate({
      data: {
        model: 'claude-3-5-haiku-latest',
        messages: userText,
        userId: userId,
        conversationId: conversationId,
      },
      onChunk: (token) => {
        if (token === "[DONE]") {
          // invalidate conversation list agar chat list auto-refresh
          queryClient.invalidateQueries({ queryKey: ["conversation", userId] });
          return;
        }
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
