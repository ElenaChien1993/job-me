import { useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import firebase from '../utils/firebase';

import ChatRecived from './elements/ChatRecived';
import ChatSent from './elements/ChatSent';

const ChatContent = ({ roomId, messages, setMessages, uid }) => {
  const bottomRef = useRef();

  // useEffect(() => {
  //   if (!roomId) return;
  //   // firebase.listenMessagesChange(roomId, setMessages);
  // }, [roomId]);

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  }, [messages])

  return (
    <>
      {messages.map(message =>
        message.uid !== uid ? (
          <ChatRecived key={uuid()} text={message.text} />
        ) : (
          <ChatSent key={uuid()} text={message.text} />
        )
      )}
      <span ref={bottomRef}></span>
    </>
  );
};

export default ChatContent;
