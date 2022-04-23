import { useState, useEffect, useRef } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Search2Icon } from '@chakra-ui/icons';
import { BiSend } from 'react-icons/bi';
import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
} from '@chakra-ui/react';
import styled, { ThemeProvider } from 'styled-components';

import ChatList from '../components/ChatList';
import firebase from '../utils/firebase';
import ChatContent from '../components/ChatContent';
import ProfileImage from '../components/ProfileImage';

const Container = styled.div`
  width: ${props => (props.theme.isCorner ? '40vw' : '')};
  height: ${props => (props.theme.isCorner ? '400px' : '650px')};
  background-color: white;
  border-radius: 20px;
  position: relative;
  z-index: 1;
  margin: ${props => (props.theme.isCorner ? '' : '0 10%')};
  top: ${props => (props.theme.isCorner ? '' : '70px')};
`;

const LeftWrapper = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  width: 35%;
  background-color: #fafafa;
  border-radius: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  padding: 25px 0 0 17px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 20px;
`;

const RightWrapper = styled.div`
  width: 65%;
  margin-left: 35%;
  display: flex;
  flex-direction: column;
`;

const SearchBar = styled.div`
  width: 90%;
  margin-bottom: 30px;
  display: ${props => (props.theme.isCorner ? 'none' : 'block')};
`;

const TopWrapper = styled.div`
  height: 64px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  border-radius: 0 20px 0 0;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #141414;
`;

const Content = styled.div`
  height: ${props => (props.theme.isCorner ? '272px' : '522px')};
  overflow: scroll;
`;

const BottomWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  border-radius: 0 0 20px 0;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  padding-left: 20px;
`;

const MessageBar = styled(Input)`
  && {
    width: 85%;
    border-radius: 20px;
    border-color: #e8e8e8;
    margin-right: 20px;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    svg {
      width: 25px;
      height: 25px;
      color: #21978b;
    }
  }
`;

const Messages = () => {
  const [text, setText] = useState('');
  const [databaseRooms, setDatabaseRooms] = useState([]);
  const [renderRooms, setRenderRooms] = useState([]);
  const [isCorner, setIsCorner] = useState(true);
  // const observeTargetRef = useRef();
  const rootRef = useRef();
  const bottomRef = useRef();
  // const unsubscribeRef = useRef();
  const { currentUserId, active, setActive } = useOutletContext();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/messages') {
      setIsCorner(false);
    } else {
      setIsCorner(true);
    }
  }, [pathname]);

  useEffect(() => {
    let unsubscribe;
    firebase.listenRoomsChange(currentUserId, setDatabaseRooms).then(res => {
      unsubscribe = res;
    });

    return unsubscribe;
  }, [currentUserId]);

  useEffect(() => {
    setRenderRooms(databaseRooms);
  }, [databaseRooms]);

  useEffect(() => {
    if (!active || currentUserId === active.latest_sender) return;
    firebase.updateRoom(active.id, { receiver_has_read: true });
  }, [active, currentUserId]);

  const send = () => {
    const MessageData = {
      uid: currentUserId,
      text: text,
      create_at: firebase.Timestamp.fromDate(new Date()),
    };
    firebase.sendMessage(active.id, MessageData);
    setText('');
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  };

  const handleEnter = e => {
    if (e.keyCode === 13) {
      send();
    }
  };

  const handleSearch = e => {
    const term = e.target.value;
    if (!term) {
      setRenderRooms(databaseRooms);
      return;
    }
    const filtered = databaseRooms.filter(
      room => room.members.includes(term) || room.latest_message.includes(term)
    );
    setRenderRooms(filtered);
  };

  return (
    <ThemeProvider theme={{ isCorner }}>
      <Container>
        <LeftWrapper>
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
          <ChatList
            rooms={renderRooms}
            active={active}
            setActive={setActive}
            isCorner={isCorner}
          />
        </LeftWrapper>
        <RightWrapper>
          <TopWrapper>
            {active && (
              <>
                <ProfileImage
                  user={active.members}
                  size={36}
                  hasBorder={false}
                  marginRight={13}
                />
                <Name>{active.members.display_name}</Name>
              </>
            )}
          </TopWrapper>

          <Content ref={rootRef}>
            {active ? (
              <ChatContent
                room={active}
                bottomRef={bottomRef}
                rootRef={rootRef}
              />
            ) : (
              <div>請選取聊天室</div>
            )}
          </Content>
          <BottomWrapper>
            <MessageBar
              type="text"
              placeholder="Type your message"
              value={text}
              onChange={event => setText(event.target.value)}
              onKeyDown={e => handleEnter(e)}
            />
            <StyledIconButton
              onClick={send}
              variant="ghost"
              aria-label="Send Message"
              icon={<BiSend />}
            />
          </BottomWrapper>
        </RightWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Messages;
