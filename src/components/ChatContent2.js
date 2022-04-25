import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import firebase from '../utils/firebase';
import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent2 = React.memo(({ room, rootRef, isCorner }) => {
  const [messages, setMessages] = useState({});
  const firstMessageRef = useRef();
  const containerRef = useRef();
  const observeTargetRef = useRef();
  const bottomRef = useRef();
  const firstRenderRef = useRef(true);
  const lastMessagesRef = useRef(false);
  const justEnteredRef = useRef();

  const { currentUserId } = useOutletContext();

  useEffect(() => {
    let unsub;
    const callback = async ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      if (lastMessagesRef.current) return;

      if (firstRenderRef.current) {
        unsub = await firebase.listenMessagesChange(
          room,
          setMessages,
          currentUserId
        );
        console.log('unsub', unsub);
        firstRenderRef.current = false;
        justEnteredRef.current = false;
      } else {
        console.log('callback')
        if (justEnteredRef.current) {
          justEnteredRef.current = false;
          return;
        }
        const newMessages = await firebase.getMoreMessages(
          room.id,
          firstMessageRef.current
        );
        console.log('new', newMessages);
        if (newMessages.length !== 0) {
          setMessages(prev => {
            return { ...prev, [room.id]: [...newMessages, ...prev[room.id]] };
          });
          if (newMessages.length < 20) {
            lastMessagesRef.current = true;
          }
        }
      }
    };

    const options = {
      root: rootRef.current,
      rootMargin: '100px',
      threshold: 1,
    };

    const target = observeTargetRef.current;
    const observer = new IntersectionObserver(callback, options);
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (unsub) {
        unsub();
      }
      observer.unobserve(target);
    };
  }, [rootRef, currentUserId, room]);

  // 當 room 改變，而且是這個 room 第一次被 render 時
  useEffect(() => {
    justEnteredRef.current = true;
    if (messages[room.id]) return;
    firstRenderRef.current = true;
    lastMessagesRef.current = false;
  }, [room]);

  useEffect(() => {
    console.log(justEnteredRef.current)
    if (!justEnteredRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  }, [messages, room]);

  useEffect(() => {
    if (!messages[room.id]) return;
    firstMessageRef.current = messages[room.id][0];
  }, [messages, room.id]);

  return (
    <div ref={containerRef}>
      <div ref={observeTargetRef}></div>
      <div>
        {messages[room.id] &&
          messages[room.id].map(message =>
            message.uid !== currentUserId ? (
              <ChatReceived
                isCorner={isCorner}
                member={room.members}
                key={uuid()}
                message={message}
              />
            ) : (
              <ChatSent key={uuid()} message={message} />
            )
          )}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
});

export default ChatContent2;
