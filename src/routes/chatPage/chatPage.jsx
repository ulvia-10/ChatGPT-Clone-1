import { useState, useRef, useEffect } from "react";
import { useGetMessager } from "../../hooks/use-get-data-messager";
import NewPrompt from "../../components/newPrompt/newPrompt";
import ReactMarkdown from "react-markdown";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useGetConversationHistory } from "../../hooks/use-get-historical-conversation";

const ChatPage = () => {
  const endRef = useRef(null);
  const mutation = useGetMessager();
  const {id} = useParams()

  const {data: conversationList} = useGetConversationHistory(id);
  const [messages, setMessages] = useState([]);

  // Sync messages with conversationList when it changes
  useEffect(() => {
    if (conversationList && Array.isArray(conversationList.messages)) {
      setMessages(conversationList.messages);
    }
  }, [conversationList]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(conversationList, 'CONVV APAA?')

  const handleSend = (userText) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "berpikir sejenak..." },
    ]);

    mutation.mutate({
      data: { model: "gpt-3.5-turbo", messages: [{ role: "user", content: userText }] },
      onChunk: (token) => {
        if (token === "[DONE]") return;

        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === "assistant") {
            if (lastMsg.content === "berpikir sejenak...") {
              lastMsg.content = token; 
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
            <div key={i} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
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
