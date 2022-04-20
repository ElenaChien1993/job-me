import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import firebase from '../utils/firebase';

import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent = ({ room, uid, rootRef, bottomRef }) => {
  const [messages, setMessages] = useState({});
  const [isFirst, setIsFirst] = useState(true)
  // const unsubscribeRef = useRef();
  const observeTargetRef = useRef();
  const firstMessageRef = useRef();

  console.log('In Content', messages);
  
  useEffect(() => {
    let unsubscribe;
    const callback = ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
  
      console.log('observer fire', isFirst, messages);
  
      if (isFirst) {
        console.log('true!')
        unsubscribe = firebase.listenMessagesChange(
          room,
          setMessages,
          uid
        );
        bottomRef.current.scrollIntoView({ behavior: 'auto' });
        setIsFirst(false);
      } else {
        firebase.getMoreMessages(room.id, messages).then((messages) => {
          console.log(messages);
          // setMessages((prev) => {
            // return { ...prev, [room.id]: [...messages, ...prev[room.id]] };
            // });
          });
        }
      };
      
    const options = {
      root: rootRef.current,
      rootMargin: '100px',
      threshold: 1,
    };

    const observer = new IntersectionObserver(callback, options);
    if (observeTargetRef.current) {
      observer.observe(observeTargetRef.current);
    }
    
    return () => {
      unsubscribe();
      observer.unobserve(observeTargetRef.current);
    };
  }, [observeTargetRef, isFirst])

  
  return (
    <>
      <div ref={observeTargetRef}></div>
      {messages[room.id] &&
        messages[room.id].map((message) =>
          message.uid !== uid ? (
            <ChatReceived key={uuid()} text={message.text} />
          ) : (
            <ChatSent key={uuid()} text={message.text} />
          )
        )}
      <div ref={bottomRef}></div>
    </>
  );
};

export default ChatContent;
