import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import firebase from '../utils/firebase';
import ChatReceived from './elements/ChatReceived';
import ChatSent from './elements/ChatSent';

const ChatContent = React.memo(
  ({ room, rootRef, isCorner, bottomRef, messages, setMessages }) => {
    const firstMessageRef = useRef();
    const observeTargetRef = useRef();
    const firstRenderRef = useRef(true);
    const lastMessagesRef = useRef(false);
    const isLoadMoreRef = useRef(false);

    const { currentUserId } = useOutletContext();

    useEffect(() => {
      const callback = async ([entry]) => {
        if (!entry || !entry.isIntersecting) return;
        if (lastMessagesRef.current) return;

        if (firstRenderRef.current) {
          if (messages[room.id] && room.latest_sender === currentUserId) return;
          await firebase.listenMessagesChange(room, setMessages, currentUserId);
          firstRenderRef.current = false;
        } else {
          isLoadMoreRef.current = true;
          const newMessages = await firebase.getMoreMessages(
            room.id,
            firstMessageRef.current
          );
          if (newMessages.length !== 0) {
            setMessages((prev) => {
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
    }, [rootRef, currentUserId, room]);

    useEffect(() => {
      if (!messages[room.id]) return;
      // if (messages[room.id].length <= 20) {
      //   console.log('2', bottomRef.current);
      // }
      if (messages[room.id].length < 20) {
        lastMessagesRef.current = true;
      }
      firstMessageRef.current = messages[room.id][0];
      if (isLoadMoreRef.current) return;
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }, [messages, room.id]);

    console.log(bottomRef.current);

    return (
      <>
        <div ref={observeTargetRef}></div>
        <div style={{ paddingBottom: '10px' }}>
          {messages[room.id] &&
            messages[room.id].map((message) =>
              message.uid !== currentUserId ? (
                <ChatReceived
                  isCorner={isCorner}
                  member={room.members}
                  key={uuid()}
                  message={message}
                  bottomRef={bottomRef}
                />
              ) : (
                <ChatSent
                  key={uuid()}
                  message={message}
                  bottomRef={bottomRef}
                />
              )
            )}
        </div>
      </>
    );
  }
);

export default ChatContent;
