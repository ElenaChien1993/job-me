import { useState, useEffect, useRef } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Search2Icon } from '@chakra-ui/icons';
import { BiSend, BiImageAdd, BiGame } from 'react-icons/bi';
import { BsFillEmojiHeartEyesFill } from 'react-icons/bs';
import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  useDisclosure,
  Flex,
  Icon,
} from '@chakra-ui/react';
import styled, { ThemeProvider } from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import ChatList from '../components/ChatList';
import firebase from '../utils/firebase';
import ProfileImage from '../components/ProfileImage';
import AddImageModal from '../components/AddImageModal';
import useClickOutside from '../hooks/useClickOutside';
import ChatContent from '../components/ChatContent';
import { device } from '../style/device';

const Container = styled.div`
  background-color: white;
  border-radius: 20px;
  position: relative;
  z-index: 1;
  max-width: 1152px;
  @media ${device.mobileM} {
    margin: ${props => (props.theme.isCorner ? '' : '0 auto 80px')};
    top: ${props => (props.theme.isCorner ? '' : '40px')};
    width: ${props => (props.theme.isCorner ? '300px' : '90%')};
    height: ${props => (props.theme.isCorner ? '454px' : 'auto')};
  }
  @media ${device.laptop} {
    margin: ${props => (props.theme.isCorner ? '' : '0 auto')};
    top: ${props => (props.theme.isCorner ? '' : '70px')};
    width: ${props => (props.theme.isCorner ? '40vw' : '80%')};
    height: ${props => (props.theme.isCorner ? '400px' : '650px')};
  }
`;

const LeftWrapper = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  width: 35%;
  background-color: #fafafa;
  border-radius: 20px 0 0 20px;
  flex-direction: column;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptop} {
    display: flex;
  }
`;

const MobileRoomList = styled.div`
  flex-direction: column;
  background-color: #ffe6ca;
  border-radius: 20px 20px 0 0;
  padding: 0 10px;
  @media ${device.mobileM} {
    display: flex;
  }
  @media ${device.laptop} {
    display: none;
  }
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
  @media ${device.mobileM} {
    font-size: 18px;
  }
  @media ${device.laptop} {
    font-size: 24px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${device.mobileM} {
    width: 100%;
    margin-left: 0;
  }
  @media ${device.laptop} {
    width: 65%;
    margin-left: 35%;
  }
`;

const SearchBar = styled.div`
  width: 90%;
  display: ${props => (props.theme.isCorner ? 'none' : 'block')};
  @media ${device.mobileM} {
    align-self: center;
    margin: 15px 0;
  }
  @media ${device.laptop} {
    margin: 0 0 30px;

  }
`;

const TopWrapper = styled.div`
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  align-items: center;
  padding-left: 20px;
  height: 64px;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptop} {
    display: flex;
  }
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #141414;
`;

const Content = styled.div`
  overflow: scroll;
  @media ${device.mobileM} {
    height: ${props => (props.theme.isCorner ? '272px' : '410px')};
  }
  @media ${device.laptop} {
    height: ${props => (props.theme.isCorner ? '272px' : '522px')};
  }
`;

const BottomWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  padding: 0 10px;
  border-radius: 0 0 20px 0;
`;

const MessageBar = styled(Input)`
  && {
    width: 85%;
    border-radius: 20px;
    border-color: #e8e8e8;
    margin-right: 10px;
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

const EmojisPicker = styled.span`
  position: absolute;
  bottom: 10px;
  right: 0;
  z-index: 1;
`;

const EmptyText = styled.div`
  color: #a0aec0;
  font-size: 30px;
`;

const Messages = () => {
  const [text, setText] = useState('');
  const [databaseRooms, setDatabaseRooms] = useState([]);
  const [renderRooms, setRenderRooms] = useState([]);
  const [isCorner, setIsCorner] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  // const observeTargetRef = useRef();
  const rootRef = useRef();
  const bottomRef = useRef();
  const emojisRef = useRef();
  const { currentUserId, active, setActive } = useOutletContext();
  const { pathname } = useLocation();

  const { onOpen, isOpen, onClose } = useDisclosure({ id: 'addImage' });

  useEffect(() => {
    if (pathname === '/messages') {
      setIsCorner(false);
    } else {
      setIsCorner(true);
    }
  }, [pathname]);

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
    if (!active || currentUserId === active.latest_sender) return;
    firebase.updateRoom(active.id, { receiver_has_read: true });
  }, [active, currentUserId]);

  const send = (value, type) => {
    const MessageData = {
      uid: currentUserId,
      text: value,
      create_at: firebase.Timestamp.fromDate(new Date()),
      type: type,
    };
    firebase.sendMessage(active.id, MessageData);
    setText('');
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  };

  const handleEnter = (e, value, type) => {
    if (e.keyCode === 13) {
      send(value, type);
    }
  };

  const handleSearch = e => {
    const term = e.target.value;
    if (!term) {
      setRenderRooms(databaseRooms.slice(0, 5));
      return;
    }
    const filtered = databaseRooms.filter(room => {
      const regex = new RegExp(term, 'gi');
      return room.members.display_name.match(regex);
    });
    setRenderRooms(filtered);
  };

  const addEmoji = e => {
    let emoji = e.native;
    setText(prev => prev + emoji);
    setShowEmojis(false);
  };

  useClickOutside(emojisRef, () => setShowEmojis(false));

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
            setRenderRooms={setRenderRooms}
            active={active}
            setActive={setActive}
            isCorner={isCorner}
            databaseRooms={databaseRooms}
          />
        </LeftWrapper>
        <MobileRoomList>
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
          <ChatList
            rooms={renderRooms}
            setRenderRooms={setRenderRooms}
            active={active}
            setActive={setActive}
            isCorner={isCorner}
            databaseRooms={databaseRooms}
          />
        </MobileRoomList>
        <RightWrapper>
          {active ? (
            <>
              <TopWrapper>
                <ProfileImage
                  user={active.members}
                  size={36}
                  hasBorder={false}
                  marginRight={13}
                />
                <Name>{active.members.display_name}</Name>
              </TopWrapper>
              <AddImageModal
                isOpen={isOpen}
                onClose={onClose}
                room={active}
                send={send}
              />
              <Content ref={rootRef}>
                <ChatContent
                  room={active}
                  bottomRef={bottomRef}
                  rootRef={rootRef}
                  isCorner={isCorner}
                />
              </Content>
              <BottomWrapper>
                <MessageBar
                  type="text"
                  placeholder="Type your message"
                  value={text}
                  onChange={event => setText(event.target.value)}
                  onKeyDown={e => handleEnter(e, text, 0)}
                />
                {showEmojis && (
                  <EmojisPicker ref={emojisRef}>
                    <Picker
                      onSelect={addEmoji}
                      emojiTooltip={true}
                      title="JobMe"
                    />
                  </EmojisPicker>
                )}
                <StyledIconButton
                  onClick={onOpen}
                  variant="ghost"
                  aria-label="Send Message"
                  icon={<BiImageAdd />}
                />
                <StyledIconButton
                  onClick={() => setShowEmojis(!showEmojis)}
                  variant="ghost"
                  aria-label="Open Emojis"
                  icon={<BsFillEmojiHeartEyesFill />}
                />
                <StyledIconButton
                  onClick={() => send(text, 0)}
                  variant="ghost"
                  aria-label="Send Message"
                  icon={<BiSend />}
                />
              </BottomWrapper>
            </>
          ) : (
            <Flex
              flexDir="column"
              align="center"
              justify="center"
              mt={['50px', null, null, null, '100px']}
              mb={['30px', null, null, null, 0]}
            >
              <Icon w="200px" h="200px" color="#A0AEC0" as={BiGame} />
              <EmptyText>請選取聊天室</EmptyText>
            </Flex>
          )}
        </RightWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Messages;
