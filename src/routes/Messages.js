import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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

const Container = styled.div`
  width: ${props => (props.theme.isCorner ? '40vw' : '100%')};
  height: ${props => (props.theme.isCorner ? '400px' : '650px')};
  background-color: white;
  border-radius: 20px;
  position: relative;
  z-index: 1;
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

const ImageWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: #f5cdc5;
  margin-right: 13px;
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
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState({});
  const [isCorner, setIsCorner] = useState(true);
  const observeTargetRef = useRef();
  const rootRef = useRef();
  const user = firebase.auth.currentUser;
  const uid = user.uid;
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/messages') {
      setIsCorner(false);
    } else {
      setIsCorner(true);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async uid => {
      const rooms = await firebase.getChatrooms(uid);
      setDatabaseRooms(rooms);
    };
    const unsubscribe = firebase.listenRoomsChange(uid, setDatabaseRooms);

    fetchRooms(uid);
    return unsubscribe;
  }, []);

  useEffect(() => {
    setRenderRooms(databaseRooms);
  }, [databaseRooms]);

  useEffect(() => {
    if (!active || uid === active.latest_sender) return;
    firebase.updateRoom(active.id, { receiver_has_read: true });
  }, [active]);

  // useEffect(() => {
  //   if (active === {}) return;
  //   firebase
  //     .getMessages(active.id, messages)
  //     .then((messages) => {
  //       console.log('get', messages)
  //       setMessages(messages)
  //     });
  // }, [active]);

  const send = () => {
    const MessageData = {
      uid: user.uid,
      text: text,
      create_at: firebase.Timestamp.fromDate(new Date()),
    };
    firebase.sendMessage(active.id, MessageData);
    setText('');
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

  console.log('In Msgs', active);
  console.log('Messages Render', messages);

  const callback = ([entry]) => {
    if (entry && entry.isIntersecting) {
      firebase.getMoreMessages(active.id, messages).then(messages => {
        setMessages(prev => {
          return { ...prev, [active.id]: [...messages, ...prev[active.id]] };
        });
      });
    }
  };

  const options = {
    root: rootRef.current,
    rootMargin: '100px',
    threshold: 1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (observeTargetRef.current) observer.observe(observeTargetRef.current);

    return () => {
      if (observeTargetRef.current)
        observer.unobserve(observeTargetRef.current);
    };
  }, [observeTargetRef.current]);

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
            uid={uid}
            isCorner={isCorner}
          />
        </LeftWrapper>
        <RightWrapper>
          <TopWrapper>
            <ImageWrapper />
            <Name>{active?.members}</Name>
          </TopWrapper>
          <Content ref={rootRef}>
            {active ? (
              <ChatContent
                room={active}
                messages={messages}
                setMessages={setMessages}
                uid={uid}
                observeTargetRef={observeTargetRef}
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
