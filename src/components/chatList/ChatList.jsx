
import { Link } from 'react-router-dom'
import './ChatList.css'
import { useGetConversationByUserId } from '../../hooks/use-get-conversation'
import { useDeleteConversation } from '../../hooks/use-delete-conversation';

const ChatList = () => {
    const {data: conversationList} = useGetConversationByUserId('d3c53862-d59a-4a28-9b2a-99a1792fbb97');
    const deleteConversation = useDeleteConversation();

    const handleDelete = (e, id) => {
        e.preventDefault();
        deleteConversation.mutate(id);
    };

    return (
        <div className='chatList'>
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new chat</Link>
            <Link to="/">Explore Cuekin AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">RECENT CHATS</span>
            <div className='list'>
                {conversationList?.map((item) => (
                    <div key={item.id} className="chat-list-item" style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/dashboard/chat/${item.id}`} style={{ flex: 1 }}>{item.title}</Link>
                        <button
                            className="delete-btn"
                            onClick={(e) => handleDelete(e, item.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                fontSize: '18px',
                                cursor: 'pointer',
                                paddingRight: '15px'
                            }}
                            title="Delete chat"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <hr />
            <div className='upgrade'>
                <img src="/logo.png" alt="" />
                <div className='texts'>
                    <span className="title">Upgrade to Pro</span>
                    <span className="description">Get access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList