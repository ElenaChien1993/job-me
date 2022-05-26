import { Image, CircularProgress } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ProfileImage from '../ProfileImage';
import useFormatedTime from '../../hooks/useFormatedTime';
import { device } from '../../style/variable';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-top: 10px;
`;

const ImageWrapper = styled.div`
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const Content = styled.div`
  background: #f5f5f5;
  border-radius: 15px;
  padding: 10px 20px;
  max-width: 55%;
  line-height: 1.4;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #999999;
  margin-left: 10px;
  align-self: flex-end;
  margin-bottom: 5px;
`;

const Text = ({ content }) => {
  return <Content>{content}</Content>;
};

Text.propTypes = {
  content: PropTypes.string.isRequired,
};

const ImageMessage = ({ content }) => {
  return (
    <Image
      objectFit="contain"
      alt="message"
      src={content}
      boxSize="100px"
      fallback={<CircularProgress isIndeterminate color="green.300" />}
    />
  );
};

ImageMessage.propTypes = {
  content: PropTypes.string.isRequired,
};

const TYPE = {
  0: Text,
  1: ImageMessage,
};

const ChatReceived = ({ member, message, bottomRef }) => {
  const timeString = useFormatedTime(message.create_at);

  const Message = TYPE[message.type];

  return (
    <Wrapper ref={bottomRef}>
      <ImageWrapper>
        <ProfileImage
          user={member}
          size={48}
          hasBorder={false}
          marginRight={16}
        />
      </ImageWrapper>
      <Message content={message.text} />
      <DateText>{timeString}</DateText>
    </Wrapper>
  );
};

ChatReceived.propTypes = {
  member: PropTypes.object.isRequired,
  message: PropTypes.shape({
    create_at: PropTypes.number,
    type: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
  bottomRef: PropTypes.object.isRequired,
};

export default ChatReceived;
