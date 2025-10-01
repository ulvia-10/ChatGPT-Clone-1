import { useParams } from 'react-router-dom'; 
import './chatPage.css';
import { useEffect, useRef } from 'react';
import NewPrompt from '../../components/newPrompt/newPrompt';

const ChatPage = () => {
  const { id } = useParams();  

  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">
          <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
          <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">test message ai for chat {id}</div>
          <div className="message user">test message user for chat {id}</div>
           <div className="message">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Rem blanditiis nulla, illo aliquid eum quia eligendi, esse, ad maxime non sit qui. 
            Vel placeat temporibus, similique optio ipsa fuga mollitia. {id}</div>
            <NewPrompt/>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
