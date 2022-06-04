import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';

import { Input, IconButton, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { BsEmojiHeartEyes } from 'react-icons/bs';
import { BiSend, BiImageAdd, BiGame } from 'react-icons/bi';
import styled, { ThemeProvider } from 'styled-components';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import ChatList from '../components/messages/ChatList';
import ChatContent from '../components/messages/ChatContent';
import firebase from '../utils/firebase';
import ProfileImage from '../components/ProfileImage';
import AddImageModal from '../components/messages/AddImageModal';
import useClickOutside from '../hooks/useClickOutside';
import { device, color } from '../style/variable';

const Container = styled.div`
  background-color: ${color.white};
  border-radius: 20px;
  position: relative;
  z-index: 3;
  max-width: ${({ theme }) => (theme.isCorner ? '800px' : '1152px')};
  box-shadow: 4px 4px 4px rgb(0 0 0 / 25%);
  @media ${device.mobileM} {
    margin: ${({ theme }) => (theme.isCorner ? '' : '0 auto 40px')};
    top: ${({ theme }) => (theme.isCorner ? '' : '40px')};
    width: ${({ theme }) => (theme.isCorner ? '300px' : '90%')};
    height: ${({ theme }) => (theme.isCorner ? '454px' : 'auto')};
  }
  @media ${device.laptopL} {
    margin: ${({ theme }) => (theme.isCorner ? '' : '0 auto 70px')};
    top: ${({ theme }) => (theme.isCorner ? '' : '40px')};
    width: ${({ theme }) => (theme.isCorner ? '40vw' : '80%')};
    height: ${({ theme }) => (theme.isCorner ? '400px' : '80vh')};
  }
`;

const LeftWrapper = styled.div`
  background-color: #fafafa;
  flex-direction: column;
  @media ${device.mobileM} {
    border-radius: 20px 20px 0 0;
    position: static;
    width: 100%;
    padding: 0 10px;
  }
  @media ${device.laptopL} {
    border-radius: 20px 0 0 20px;
    position: absolute;
    left: 0;
    height: 100%;
    width: 35%;
    padding: 0;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${device.mobileM} {
    width: 100%;
    margin-left: 0;
    height: 350px;
  }
  @media ${device.laptopL} {
    width: 65%;
    height: 100%;
    margin-left: 35%;
  }
`;

const TopWrapper = styled.div`
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
  align-items: center;
  padding-left: 20px;
  height: 64px;
  border-radius: 0 20px 0 0;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.laptopL} {
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
    height: ${({ theme }) => (theme.isCorner ? '285px' : '410px')};
  }
  @media ${device.laptopL} {
    height: ${({ theme }) => (theme.isCorner ? '272px' : '100%')};
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
      color: ${color.primary};
    }
  }
`;

const EmojisPicker = styled.span`
  position: absolute;
  bottom: 10px;
  right: 0;
  z-index: 1;
`;

const PickerWrapper = styled.div`
  position: relative;
`;

const CloseButton = styled(IconButton)`
  && {
    position: absolute;
    right: -15px;
    top: -16px;
  }
`;

const EmptyText = styled.div`
  color: #a0aec0;
  font-size: 18px;
  text-align: center;
  & span {
    color: ${color.secondary};
    font-weight: bold;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  @media ${device.tablet} {
    font-size: 24px;
  }
`;

const Messages = () => {
  const [text, setText] = useState('');
  const [isCorner, setIsCorner] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [messages, setMessages] = useState({});
  const rootRef = useRef();
  const bottomRef = useRef();
  const emojisRef = useRef();
  const isSendingRef = useRef(false);
  const { currentUserId, active, setActive, databaseRooms, setError } =
    useOutletContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { onOpen, isOpen, onClose } = useDisclosure({ id: 'addImage' });

  useEffect(() => {
    if (pathname === '/messages') {
      setIsCorner(false);
    } else {
      setIsCorner(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!active || currentUserId === active.latest_sender) return;
    firebase.updateRoom(active.id, { receiver_has_read: true, unread_qty: 0 });
  }, [active, currentUserId]);

  const send = async (value, type) => {
    if (value === '' && type === 0) return;
    const MessageData = {
      uid: currentUserId,
      text: value,
      create_at: firebase.Timestamp.fromDate(new Date()),
      type: type,
    };
    try {
      await firebase.sendMessage(active.id, MessageData);
      setText('');
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    } catch (err) {
      console.log(err);
      setError({ type: 1, message: '傳送訊息失敗，請稍後再試' });
    }
  };

  const handleEnter = async (e, value, type) => {
    if (e.keyCode === 13) {
      if (isSendingRef.current) return;
      isSendingRef.current = true;
      await send(value, type);
      isSendingRef.current = false;
    }
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
          <ChatList active={active} setActive={setActive} isCorner={isCorner} />
        </LeftWrapper>
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
                  key={active.id}
                  room={active}
                  bottomRef={bottomRef}
                  rootRef={rootRef}
                  isCorner={isCorner}
                  messages={messages}
                  setMessages={setMessages}
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
                    <PickerWrapper>
                      <Picker
                        onSelect={addEmoji}
                        emojiTooltip={true}
                        title="JobMe"
                      />
                    </PickerWrapper>
                    <CloseButton
                      isRound
                      size="sm"
                      colorScheme="brand"
                      aria-label="delete item"
                      icon={<SmallCloseIcon />}
                      onClick={() => setShowEmojis(false)}
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
                  icon={<BsEmojiHeartEyes />}
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
            <Flex flexDir="column" align="center" justify="center">
              <Icon w="100px" h="100px" color="#A0AEC0" as={BiGame} />
              {databaseRooms.length === 0 ? (
                <EmptyText>
                  尚無聊天室紀錄
                  <br />
                  要不要去<span onClick={() => navigate('/explore')}>探索</span>
                  和其他會員交流一下？
                </EmptyText>
              ) : (
                <EmptyText>請選取聊天室</EmptyText>
              )}
            </Flex>
          )}
        </RightWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Messages;
