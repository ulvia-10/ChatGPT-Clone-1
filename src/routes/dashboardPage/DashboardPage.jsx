

import { useState } from 'react';
import './dashboardPage.css';
import ChatPage from '../chatPage/chatPage';


const DashboardPage = () => {
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [input, setInput] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsChatStarted(true);
    };

    if (isChatStarted) {
     return <ChatPage />;
    }

    return (
        <div className='dashboardPage'>
            <div className="texts">
                <div className="log">
                    <img src="/logo.png" alt="" />
                    <h1>Cuekin AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>Create a New Chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze Images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Help me with my code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form className="form" onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Ask me anything"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button type="submit">
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DashboardPage