import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import firebase from '../utils/firebase';

import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent = ({ room, uid, rootRef, bottomRef }) => {
  const [messages, setMessages] = useState({});
  // const unsubscribeRef = useRef();
  const observeTargetRef = useRef();
  const firstMessageRef = useRef();
  const firstRenderRef = useRef(true);
  const lastMessagesRef = useRef(false);
  const containerRef = useRef();

  console.log('In Content', bottomRef.current);

  useEffect(() => {
    if (!messages[room.id]) return;
    firstMessageRef.current = messages[room.id][0];
  }, [messages, room.id]);

  useEffect(() => {
    // bottomRef.current.scrollIntoView(false, { behavior: 'auto' });

    if (messages[room.id]) return;
    firstRenderRef.current = true;
    lastMessagesRef.current = false;
  }, [room]);
  
  console.log(rootRef.current.scrollTop, rootRef.current.scrollHeight)
  useEffect(() => {
    let unsubscribe;
    const callback = ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      if (lastMessagesRef.current) return;
      console.log('observer fire', firstRenderRef.current, firstMessageRef);

      if (firstRenderRef.current) {
        firebase.listenMessagesChange(room, setMessages, uid).then(res => {
          unsubscribe = res;
          rootRef.current.scrollTop = rootRef.current.scrollHeight;
          // rootRef.current.scrollTo(0, rootRef.current.scrollHeight)
          // bottomRef.current.scrollIntoView();
          firstRenderRef.current = false;
        });
      } else {
        firebase
          .getMoreMessages(room.id, firstMessageRef.current)
          .then(messages => {
            console.log(messages);
            setMessages((prev) => {
              return { ...prev, [room.id]: [...messages, ...prev[room.id]] };
            });
            if (messages.length < 20) {
              lastMessagesRef.current = true;
            }
          });
      }
    };

    console.log(unsubscribe);

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
      // unsubscribe();
      observer.unobserve(observeTargetRef.current);
    };
  }, [observeTargetRef, firstRenderRef, bottomRef, room, rootRef, uid]);

  return (
    <div ref={containerRef}>
      <div ref={observeTargetRef}></div>
      {messages[room.id] &&
        messages[room.id].map(message =>
          message.uid !== uid ? (
            <ChatReceived key={uuid()} text={message.text} />
          ) : (
            <ChatSent key={uuid()} text={message.text} />
          )
        )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatContent;
