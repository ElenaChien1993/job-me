import React from 'react';
import { useOutletContext } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { v4 as uuid } from 'uuid';

import ProfileImage from './ProfileImage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const LATEST_MESSAGE_TYPE = props => ({
  0: props.latest.message,
  1: '傳送了一張照片',
  default: '',
});

const ChatList = React.memo(({ rooms, active, setActive, isCorner }) => {
  const { currentUserId } = useOutletContext();

  return (
    <ThemeProvider theme={{ isCorner }}>
      <Container>
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
                isRead={room.receiver_has_read || currentUserId === room.latest_sender}
              >
                {LATEST_MESSAGE_TYPE(room)[room.latest.message_type]}
              </LatestMessage>
            </BriefContent>
            <DateText>{room.latest.timestamp}</DateText>
            <NewMessage
              isRead={room.receiver_has_read || currentUserId === room.latest_sender}
            />
          </ChatWrapper>
        ))}
      </Container>
    </ThemeProvider>
  );
});

export default ChatList;
