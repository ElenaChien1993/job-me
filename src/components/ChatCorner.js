import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import styled from 'styled-components';

import useClickOutside from '../hooks/useClickOutside';
import Messages from '../routes/Messages';
import { device } from '../style/device';

const Container = styled.div`
  position: fixed;
  @media ${device.mobileM} {
    bottom: 40px;
    right: 40px;
  }
  @media ${device.tablet} {
    right: 100px;
    bottom: 60px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  z-index: 0;
  right: 0;
  bottom: 0;
`;

const ChatCorner = () => {
  const cornerRef = useRef();
  const { chatOpen, setChatOpen } = useOutletContext();

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
