import { Link } from 'react-router-dom'
import './ChatList.css'

const ChatList = () => {
    return (
        <div className='chatList'>
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new chat</Link>
            <Link to="/">Explore Cuekin AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">RECENT CHATS</span>
            <div className='list'>
                <Link to="/dashboard/1">Chat 1</Link>
                <Link to="/dashboard/2">Chat 2</Link>
                <Link to="/dashboard/3">Chat 3</Link>
                <Link to="/dashboard/4">Chat 4</Link>
                <Link to="/dashboard/5">Chat 5</Link>
                <Link to="/dashboard/6">Chat 6</Link>
                <Link to="/dashboard/7">Chat 7</Link>
                <Link to="/dashboard/8">Chat 8</Link>
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