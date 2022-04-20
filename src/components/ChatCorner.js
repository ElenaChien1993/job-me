import { IconButton } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import styled from 'styled-components';

import useClickOutside from '../hooks/useClickOutside';
import Messages from '../routes/Messages';

const Container = styled.div`
  position: fixed;
  bottom: 60px;
  right: 100px;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const ChatCorner = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const cornerRef = useRef();

  useClickOutside(cornerRef, () => chatOpen && setChatOpen(false));

  return (
    <Container ref={cornerRef}>
      {chatOpen && <Messages isCorner />}
      <IconWrapper>
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
      </IconWrapper>
    </Container>
  );
};

export default ChatCorner;
