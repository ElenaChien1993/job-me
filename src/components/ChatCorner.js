import { useOutletContext } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import styled from 'styled-components';

import Messages from '../routes/Messages';
import { device, color } from '../style/variable';

const IconWrapper = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 7%;
  @media ${device.mobileM} {
    right: 10%;
  }
  @media ${device.tablet} {
    right: 7%;
  }
`;

const MessageWrapper = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 15%;
  @media ${device.mobileM} {
    right: 10%;
  }
  @media ${device.tablet} {
    right: 7%;
  }
`;

const ChatCorner = () => {
  const { chatOpen, setChatOpen } = useOutletContext();

  return (
    <>
      {chatOpen && (
        <MessageWrapper>
          <Messages isCorner />
        </MessageWrapper>
      )}
      <IconWrapper>
        <IconButton
          w="50px"
          h="50px"
          isRound
          color="white"
          bg={color.primary}
          aria-label="Open Chat"
          fontSize="30px"
          _hover={{ filter: 'brightness(150%)' }}
          onClick={() => setChatOpen(!chatOpen)}
          icon={chatOpen ? <ChevronDownIcon /> : <IoChatbubbleEllipsesSharp />}
        />
      </IconWrapper>
    </>
  );
};

export default ChatCorner;
