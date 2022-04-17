import { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ChatWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 16px;
  background-color: ${props => (props.isSelected ? '#D5F4F7' : '')};
  cursor: pointer;
  &:hover {
    background-color: #D5F4F7;
  }
`;

const ImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: #f5cdc5;
  margin-right: 13px;
`;

const BriefContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #141414;
  margin-bottom: 10px;
`;

const LatestMessage = styled.div`
  color: #4f5665;
  font-size: 16px;
`;

const DateText = styled.div`
  align-self: flex-start;
  font-size: 14px;
  margin-left: auto;
`;

const ChatList = ({ rooms, active, setActive}) => {
  return (
    <Container>
      {rooms.map(room => (
        <ChatWrapper isSelected={active === room.id} key={uuid()} onClick={() => setActive(room.id)}>
          <ImageWrapper />
          <BriefContent>
            <Name>{room.member}</Name>
            <LatestMessage>好啊那我們再聯絡</LatestMessage>
          </BriefContent>
          <DateText>{room.latest_timestamp}</DateText>
        </ChatWrapper>
      ))}
    </Container>
  );
};

export default ChatList;
