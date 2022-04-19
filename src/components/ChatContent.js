import React, { useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import firebase from '../utils/firebase';

import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent = 
  ({ room, messages, setMessages, uid, observeTargetRef }) => {
    const bottomRef = useRef();
    console.log('In Content', room)

    // useEffect(() => {
    //   if (!room.id) return;
    //   const unsubscribe = firebase.listenMessagesChange(room, setMessages, uid);

    //   return unsubscribe;
    // }, [room]);

    useEffect(() => {
      if (!room.id || messages[room.id]) return;
      
      console.log('in dep==room useEffect')
      const unsubscribe = firebase.listenMessagesChange(room, setMessages, uid);
      return unsubscribe;
    }, [room])

    useEffect(() => {
      if (messages[room.id] && messages[room.id].length > 20) {
        console.log('大於');
      } else {
        bottomRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, [messages]);

    console.log('ChatContent render');

    return (
      <>
        <div ref={observeTargetRef}></div>
        {messages[room.id] && messages[room.id].map((message) =>
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


export default ChatContent;
