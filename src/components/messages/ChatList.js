import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

import { device, color } from '../../style/variable';
import ProfileImage from '../ProfileImage';

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: scroll;
  flex-direction: row;
  @media ${device.laptop} {
    flex-direction: column;
    height: ${({ theme }) => (theme.isCorner ? '82%' : '76%')};
  }
`;

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) => (isSelected ? 'white' : '')};
  box-shadow: ${({ isSelected }) =>
    isSelected ? '0 4px 16px rgb(91 96 103 / 8%)' : ''};
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: white;
    box-shadow: 0 4px 16px rgb(91 96 103 / 8%);
    transition: all 0.2s ease-in;
  }
  width: 90px;
  min-width: 90px;
  padding: 5px 3px;
  margin: 5px 3px;
  flex-direction: column;
  justify-content: center;
  @media ${device.laptop} {
    width: auto;
    min-width: auto;
    padding: ${({ theme }) => (theme.isCorner ? '8px 5px' : '10px 10px')};
    margin: ${({ theme }) => (theme.isCorner ? '2px 5px' : '5px 10px')};
    flex-direction: row;
  }
`;

const BriefContent = styled.div`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 0;
  width: 100%;
  @media ${device.laptop} {
    margin-left: 13px;
    width: 100%;
  }
`;

const Name = styled.div`
  font-weight: 600;
  color: #141414;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  margin: 5px auto;
  @media ${device.laptop} {
    font-size: ${({ theme }) => (theme.isCorner ? '16px' : '20px')};
    margin: 0 0 5px;
  }
`;

const LatestMessage = styled.div`
  color: #4f5665;
  font-size: ${({ theme }) => (theme.isCorner ? '13px' : '16px')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 90%;
  font-weight: ${({ isRead }) => (isRead ? '400' : '700')};
  display: none;
  @media ${device.laptop} {
    display: block;
  }
`;

const DateText = styled.div`
  font-size: 14px;
  color: #aeaeae;
  display: none;
  @media ${device.laptop} {
    display: ${({ theme }) => (theme.isCorner ? 'none' : 'block')};
  }
`;

const Upper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NewMessage = styled.div`
  position: absolute;
  background-color: red;
  color: white;
  text-align: center;
  font-weight: 700;
  display: ${({ isRead }) => (isRead ? 'none' : 'block')};
  height: 22px;
  width: 22px;
  border-radius: 11px;
  font-size: 13px;
  right: ${({ theme }) => (theme.isCorner ? '17px' : '13px')};
  top: ${({ theme }) => (theme.isCorner ? '28px' : '38px')};
  @media ${device.laptop} {
    font-size: ${({ theme }) => (theme.isCorner ? '13px' : '16px')};
    height: ${({ theme }) => (theme.isCorner ? '22px' : '26px')};
    width: ${({ theme }) => (theme.isCorner ? '22px' : '26px')};
    border-radius: ${({ theme }) => (theme.isCorner ? '11px' : '13px')};
    top: ${({ theme }) => (theme.isCorner ? '22px' : '39px')};
    right: ${({ theme }) => (theme.isCorner ? '11px' : '25px')};
  }
`;

const TitleWrapper = styled.div`
  flex-direction: column;
  display: ${({ theme }) => (theme.isCorner ? 'none' : 'flex')};
  padding: 15px 0 0 10px;
  @media ${device.laptop} {
    display: flex;
    padding: ${({ theme }) =>
      theme.isCorner ? '15px 0 0 20px' : '25px 0 0 25px'};
  }
`;

const Title = styled.div`
  font-weight: 600;
  color: ${color.primary};
  font-size: 18px;
  @media ${device.laptop} {
    display: block;
    font-size: ${({ theme }) => (theme.isCorner ? '18px' : '24px')};
    margin-bottom: 20px;
  }
`;

const SearchBar = styled.div`
  display: ${({ theme }) => (theme.isCorner ? 'none' : 'block')};
  margin: 15px 0;
  width: 99%;
  @media ${device.laptop} {
    margin: 0 0 30px;
    width: 94%;
  }
`;

const LATEST_MESSAGE_TYPE = props => ({
  0: props.latest.message,
  1: '?????????????????????',
});

const ChatList = React.memo(({ active, setActive, isCorner }) => {
  const [renderRooms, setRenderRooms] = useState([]);
  const [term, setTerm] = useState('');
  const { currentUserId, databaseRooms } = useOutletContext();
  const rootRef = useRef();
  const observeTargetRef = useRef();
  const firstRenderRef = useRef(true);
  const roomsQtyRef = useRef(0);

  useEffect(() => {
    setRenderRooms(databaseRooms.slice(0, 6));
  }, [databaseRooms]);

  useEffect(() => {
    roomsQtyRef.current = renderRooms.length;
  }, [renderRooms]);

  useEffect(() => {
    if (term === '') {
      setRenderRooms(databaseRooms.slice(0, 6));
      return;
    }
    const regex = new RegExp(term, 'gi');
    const filtered = databaseRooms.filter(room => {
      return room.members.display_name.match(regex);
    });
    setRenderRooms(filtered);
  }, [term, databaseRooms]);

  useEffect(() => {
    const callback = ([entry]) => {
      if (term !== '') return;
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      if (!entry || !entry.isIntersecting) return;
      const startIndex = roomsQtyRef.current;
      if (startIndex === databaseRooms.length) return;

      setRenderRooms(prev => [
        ...prev,
        ...databaseRooms.slice(startIndex, startIndex + 5),
      ]);
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
  }, [databaseRooms, term]);

  return (
    <ThemeProvider theme={{ isCorner }}>
      <TitleWrapper>
        <Title>Messages</Title>
        <SearchBar>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray.300" />}
            />
            <Input
              backgroundColor="white"
              borderColor={color.primary}
              type="text"
              placeholder="Search people"
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
          </InputGroup>
        </SearchBar>
      </TitleWrapper>
      <Container ref={rootRef}>
        {renderRooms.map(room => (
          <ChatWrapper
            isSelected={active?.id === room.id}
            key={room.id}
            onClick={() => setActive(room)}
          >
            <ProfileImage
              user={room.members}
              size={isCorner ? 40 : 50}
              hasBorder={false}
              marginRight={0}
            />
            <BriefContent>
              <Upper>
                <Name>{room.members.display_name}</Name>
                <DateText>{room.latest.timestamp}</DateText>
              </Upper>
              <LatestMessage
                isRead={
                  room.receiver_has_read || currentUserId === room.latest_sender
                }
              >
                {LATEST_MESSAGE_TYPE(room)[room.latest.message_type]}
              </LatestMessage>
            </BriefContent>
            <NewMessage
              isRead={
                room.receiver_has_read || currentUserId === room.latest_sender
              }
            >
              {room.unread_qty}
            </NewMessage>
          </ChatWrapper>
        ))}
        <div ref={observeTargetRef}></div>
      </Container>
    </ThemeProvider>
  );
});

ChatList.propTypes = {
  active: PropTypes.object,
  setActive: PropTypes.func.isRequired,
  isCorner: PropTypes.bool.isRequired,
};

export default ChatList;
