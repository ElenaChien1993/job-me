import { Image, CircularProgress } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import useFormatedTime from '../../hooks/useFormatedTime';
import { color } from '../../style/variable';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  padding-left: 20px;
  margin-top: 10px;
  justify-content: flex-end;
  margin-right: 20px;
`;

const Content = styled.div`
  background: #f5f5f5;
  border-radius: 15px;
  padding: 10px 20px;
  max-width: 60%;
  background-color: ${color.primary};
  color: white;
  line-height: 1.4;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #999999;
  margin-right: 10px;
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

const ChatSent = ({ message, bottomRef }) => {
  const timeString = useFormatedTime(message.create_at);

  const Message = TYPE[message.type];

  return (
    <Wrapper ref={bottomRef}>
      <DateText>{timeString}</DateText>
      <Message content={message.text} />
    </Wrapper>
  );
};

ChatSent.propTypes = {
  message: PropTypes.shape({
    create_at: PropTypes.number,
    type: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
  bottomRef: PropTypes.object.isRequired,
};

export default ChatSent;
