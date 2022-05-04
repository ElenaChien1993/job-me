import { Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { v4 as uuid } from 'uuid';
import { device } from '../style/device';
import firebase from '../utils/firebase';

import ProfileImage from './ProfileImage';

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: scroll;
  @media ${device.mobileM} {
    flex-direction: row;
  }
  @media ${device.laptop} {
    flex-direction: column;
  }
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
  @media ${device.mobileM} {
    padding: 10px 10px;
    flex-direction: column;
  }
  @media ${device.laptop} {
    padding: 15px 16px;
    flex-direction: row;
  }
`;

const BriefContent = styled.div`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @media ${device.mobileM} {
    margin-left: 0;
  }
  @media ${device.laptop} {
    margin-left: 13px;
  }
`;

const Name = styled.div`
  font-weight: 600;
  color: #141414;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @media ${device.mobileM} {
    font-size: 16px;
    margin: 5px 0;
  }
  @media ${device.laptop} {
    font-size: 20px;
    margin: 0 0 10px;
  }
`;

const LatestMessage = styled.div`
  color: #4f5665;
  font-size: 16px;
  font-weight: ${(props) => (props.isRead ? '400' : '700')};
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptop} {
    display: block;
  }
`;

const DateText = styled.div`
  text-align: right;
  align-self: flex-start;
  font-size: 14px;
  margin-left: auto;
  display: ${(props) => (props.theme.isCorner ? 'none' : 'block')};
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptop} {
    display: block;
  }
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

const TitleWrapper = styled.div`
  padding: 25px 0 0 17px;
  flex-direction: column;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptop} {
    display: flex;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 20px;
  @media ${device.mobileM} {
    font-size: 18px;
  }
  @media ${device.laptop} {
    font-size: 24px;
  }
`;

const SearchBar = styled.div`
  width: 90%;
  display: ${(props) => (props.theme.isCorner ? 'none' : 'block')};
  @media ${device.mobileM} {
    align-self: center;
    margin: 15px 0;
  }
  @media ${device.laptop} {
    margin: 0 0 30px;
  }
`;

const LATEST_MESSAGE_TYPE = (props) => ({
  0: props.latest.message,
  1: '傳送了一張照片',
  default: '',
});

const ChatList = React.memo(({ active, setActive, isCorner }) => {
  const [databaseRooms, setDatabaseRooms] = useState([]);
  const [renderRooms, setRenderRooms] = useState([]);
  const { currentUserId } = useOutletContext();
  const rootRef = useRef();
  const observeTargetRef = useRef();
  const firstRenderRef = useRef(true);
  const roomsQtyRef = useRef(0);

  useEffect(() => {
    const unsubscribe = firebase.listenRoomsChange(
      currentUserId,
      setDatabaseRooms
    );

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    setRenderRooms(databaseRooms.slice(0, 5));
  }, [databaseRooms]);

  useEffect(() => {
    roomsQtyRef.current = renderRooms.length;
  }, [renderRooms]);

  const handleSearch = (e) => {
    const term = e.target.value;
    if (!term) {
      setRenderRooms(databaseRooms.slice(0, 5));
      return;
    }
    const filtered = databaseRooms.filter((room) => {
      const regex = new RegExp(term, 'gi');
      return room.members.display_name.match(regex);
    });
    setRenderRooms(filtered);
  };

  useEffect(() => {
    const callback = ([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }

      const startIndex = roomsQtyRef.current;
      if (startIndex === databaseRooms.length) return;

      console.log(
        'observer fire',
        startIndex,
        databaseRooms.slice(startIndex, startIndex + 5)
      );
      setRenderRooms((prev) => [
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
  }, [databaseRooms]);

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
              type="text"
              placeholder="Search people or message"
              onChange={handleSearch}
            />
          </InputGroup>
        </SearchBar>
      </TitleWrapper>
      <Container ref={rootRef}>
        {renderRooms.map((room) => (
          <ChatWrapper
            isSelected={active?.id === room.id}
            key={room.id}
            onClick={() => setActive(room)}
          >
            <ProfileImage
              user={room.members}
              size={50}
              hasBorder={false}
              marginRight={0}
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
