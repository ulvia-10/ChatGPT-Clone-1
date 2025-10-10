
import { Link } from 'react-router-dom'
import './ChatList.css'
import { useGetConversationByUserId } from '../../hooks/use-get-conversation'
import { useDeleteConversation } from '../../hooks/use-delete-conversation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';


const ChatList = () => {
    const { user, isLoaded } = useUser();
    const userId = user?.id;
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const {data: conversationList} = useGetConversationByUserId(userId);
    const list = Array.isArray(conversationList) ? conversationList : [];
    const deleteConversation = useDeleteConversation();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log('deleteConversation status:', {
            isSuccess: deleteConversation.isSuccess,
            isError: deleteConversation.isError,
            error: deleteConversation.error,
            isLoading: deleteConversation.isLoading,
            data: deleteConversation.data
        });
        if (deleteConversation.isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["conversation", userId] });
            queryClient.refetchQueries({ queryKey: ["conversation", userId] });
        }
        if (deleteConversation.isError) {
            alert('Delete error: ' + (deleteConversation.error?.message || 'Unknown error'));
        }
    }, [
        deleteConversation.isSuccess,
        deleteConversation.isError,
        deleteConversation.error,
        deleteConversation.isLoading,
        deleteConversation.data,
        queryClient,
        userId
    ]);

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
                {list.map((item) => (
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