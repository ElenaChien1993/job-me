import { IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import styled from 'styled-components';
import Messages from '../routes/Messages';

const Container = styled.div`
  position: fixed;
  bottom: 60px;
  right: 100px;

`;

const ChatCorner = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Container>
      <Messages isCorner/>
      <IconButton
        w="50px"
        h="50px"
        isRound
        color="white"
        bg="#306172"
        aria-label="Open Chat"
        fontSize="30px"
        _hover={{ filter: 'brightness(150%)', color: 'black' }}
        onClick={() => setChatOpen(!chatOpen)}
        icon={<IoChatbubbleEllipsesSharp />}
      />
    </Container>
  );
};

export default ChatCorner;
