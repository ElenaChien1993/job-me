import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

import firebase from '../../utils/firebase';
import ChatReceived from '../elements/ChatReceived';
import ChatSent from '../elements/ChatSent';

const ChatContent = ({ room, rootRef, bottomRef, messages, setMessages }) => {
  const firstMessageRef = useRef();
  const observeTargetRef = useRef();
  const firstRenderRef = useRef(true);
  const lastMessagesRef = useRef(false);
  const isLoadMoreRef = useRef(false);

  const { currentUserId } = useOutletContext();

  useEffect(() => {
    const unsubscribe = firebase.listenMessagesChange(
      room,
      currentUserId,
      data => {
        setMessages(prev => {
          return {
            ...prev,
            [room.id]: data,
          };
        });
      }
    );

    return () => unsubscribe();
  }, [currentUserId, room, setMessages]);

  useEffect(() => {
    const callback = async ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      if (lastMessagesRef.current) return;

      if (!firstMessageRef.current && firstRenderRef.current) {
        firstRenderRef.current = false;
      } else {
        isLoadMoreRef.current = true;
        const newMessages = await firebase.getMoreMessages(
          room.id,
          firstMessageRef.current
        );
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
  }, [rootRef, currentUserId, room, setMessages]);

  useEffect(() => {
    if (!messages[room.id] || !bottomRef.current) return;
    if (messages[room.id].length < 20) {
      lastMessagesRef.current = true;
    }
    firstMessageRef.current = messages[room.id][0];
    if (isLoadMoreRef.current) {
      isLoadMoreRef.current = false;
      return;
    }
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  }, [messages, room.id, bottomRef]);

  return (
    <>
      <div ref={observeTargetRef} />
      <div style={{ paddingBottom: '10px' }}>
        {messages[room.id] &&
          messages[room.id].map(message =>
            message.uid !== currentUserId ? (
              <ChatReceived
                member={room.members}
                key={message.id}
                message={message}
                bottomRef={bottomRef}
              />
            ) : (
              <ChatSent
                key={message.id}
                message={message}
                bottomRef={bottomRef}
              />
            )
          )}
      </div>
    </>
  );
};

ChatContent.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    members: PropTypes.object,
  }).isRequired,
  rootRef: PropTypes.object,
  bottomRef: PropTypes.object,
  messages: PropTypes.object.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default ChatContent;
