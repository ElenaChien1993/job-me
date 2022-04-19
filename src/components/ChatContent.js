import React, { useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import firebase from '../utils/firebase';

import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent = React.memo(
  ({ room, messages, setMessages, uid, observeTargetRef }) => {
    const bottomRef = useRef();

    // useEffect(() => {
    //   if (!room.id) return;
    //   const unsubscribe = firebase.listenMessagesChange(room, setMessages, uid);

    //   return unsubscribe;
    // }, [room]);

    useEffect(() => {
      if (messages && messages.length > 20) {
        console.log('大於');
      } else {
        bottomRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, [messages]);

    console.log('render');
    return (
      <>
        <div ref={observeTargetRef}></div>
        {messages.map((message) =>
          message.uid !== uid ? (
            <ChatReceived key={uuid()} text={message.text} />
          ) : (
            <ChatSent key={uuid()} text={message.text} />
          )
        )}
        <span ref={bottomRef}></span>
      </>
    );
  }
);

export default ChatContent;
