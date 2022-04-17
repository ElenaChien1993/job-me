import { useState, useEffect } from 'react';
import { Search2Icon } from '@chakra-ui/icons';
import { BiSend } from 'react-icons/bi';
import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { formatDistance, formatRelative } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import styled from 'styled-components';

import ChatList from '../components/ChatList';
import ChatRecived from '../components/elements/ChatRecived';
import ChatSent from '../components/elements/ChatSent';
import firebase from '../utils/firebase';
import ChatContent from '../components/ChatContent';

const Container = styled.div`
  width: 100%;
  height: 650px;
  background-color: white;
  border-radius: 20px;
  position: relative;
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
  height: 522px;
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
  const [rooms, setRooms] = useState([]);
  const [active, setActive] = useState({});
  const [messages, setMessages] = useState(null);
  const user = firebase.auth.currentUser;
  const uid = user.uid;

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsData = await firebase.getChatrooms(uid);
      const transformedRooms = await Promise.all(
        roomsData.map(async room => {
          const timeRelative = formatRelative(
            new Date(room.latest_timestamp.seconds * 1000),
            new Date(),
            { locale: zhTW, addSuffix: true }
          );
          const friendId = room.members.filter(id => id !== uid);
          const name = await firebase.getUserName(friendId[0]);
          return { ...room, member: name, latest_timestamp: timeRelative };
        })
      );
      setRooms(transformedRooms);
      setActive(transformedRooms[0]);
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (active === {}) return;
    firebase.getMessages(active.id).then(messages => setMessages(messages));
  }, [active]);

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
  // console.log(rooms, active);

  return (
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
                // value={value}
                // onChange={event => setValue(event.target.value)}
              />
            </InputGroup>
          </SearchBar>
        </TitleWrapper>
        <ChatList rooms={rooms} active={active} setActive={setActive} />
      </LeftWrapper>
      <RightWrapper>
        <TopWrapper>
          <ImageWrapper />
          <Name>{active?.member}</Name>
        </TopWrapper>
        <Content>
          {messages && (
            <ChatContent
              roomId={active.id}
              messages={messages}
              setMessages={setMessages}
              uid={uid}
            />
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
  );
};

export default Messages;
