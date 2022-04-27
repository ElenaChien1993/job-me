import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { v4 as uuid } from 'uuid';

import ProfileImage from './ProfileImage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px 16px;
  background-color: ${(props) => (props.isSelected ? '#D5F4F7' : '')};
  cursor: pointer;
  &:hover {
    background-color: #d5f4f7;
  }
`;

const BriefContent = styled.div`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #141414;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const LatestMessage = styled.div`
  color: #4f5665;
  font-size: 16px;
  font-weight: ${(props) => (props.isRead ? '400' : '700')};
`;

const DateText = styled.div`
  align-self: flex-start;
  font-size: 14px;
  margin-left: auto;
  display: ${(props) => (props.theme.isCorner ? 'none' : 'block')};
`;

const NewMessage = styled.div`
  position: absolute;
  height: 12px;
  width: 12px;
  border-radius: 6px;
  background-color: red;
  right: 20px;
  display: ${(props) => (props.isRead ? 'none' : 'block')};
`;

const LATEST_MESSAGE_TYPE = (props) => ({
  0: props.latest.message,
  1: '傳送了一張照片',
  default: '',
});

const ChatList = React.memo(({ rooms, active, setActive, isCorner, setRenderRooms, databaseRooms }) => {
  const { currentUserId } = useOutletContext();
  const rootRef = useRef();
  const observeTargetRef = useRef();
  const firstRenderRef = useRef(true);
  const roomsQtyRef = useRef(0);

  useEffect(() => {
    roomsQtyRef.current = rooms.length;
  }, [rooms])

  useEffect(() => {
    const callback = ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      
      const startIndex = roomsQtyRef.current;
      if (startIndex === databaseRooms.length) return;
      
      console.log('observer fire',startIndex ,databaseRooms.slice(startIndex, startIndex + 5));
      setRenderRooms(prev => [...prev, ...databaseRooms.slice(startIndex, startIndex + 5)])
    };

    const options = {
      root: rootRef.current,
      rootMargin: '30px',
      threshold: 1,
    };

    const target = observeTargetRef.current;
    const observer = new IntersectionObserver(callback, options);
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.unobserve(target);
    };
  }, [databaseRooms, rooms]);

  return (
    <ThemeProvider theme={{ isCorner }}>
      <Container ref={rootRef}>
        {rooms.map((room) => (
          <ChatWrapper
            isSelected={active?.id === room.id}
            key={uuid()}
            onClick={() => setActive(room)}
          >
            <ProfileImage
              user={room.members}
              size={50}
              hasBorder={false}
              marginRight={13}
            />
            <BriefContent>
              <Name>{room.members.display_name}</Name>
              <LatestMessage
                isRead={
                  room.receiver_has_read || currentUserId === room.latest_sender
                }
              >
                {LATEST_MESSAGE_TYPE(room)[room.latest.message_type]}
              </LatestMessage>
            </BriefContent>
            <DateText>{room.latest.timestamp}</DateText>
            <NewMessage
              isRead={
                room.receiver_has_read || currentUserId === room.latest_sender
              }
            />
          </ChatWrapper>
        ))}
        <div ref={observeTargetRef}></div>
      </Container>
    </ThemeProvider>
  );
});

export default ChatList;
