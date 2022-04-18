import { IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  bottom: 30px;
`

const ChatCorner = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Container>
      <IconButton
        w="30px"
        isRound
        color="white"
        bg="#306172"
        aria-label="Open Chat"
        fontSize="20px"
        _hover={{ filter: 'brightness(150%)', color: 'black' }}
        onClick={() => setChatOpen(!chatOpen)}
        icon={<IoChatbubbleEllipsesSharp />}
      />
    </Container>
  );
};

export default ChatCorner;
