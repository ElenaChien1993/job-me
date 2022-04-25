import React from 'react';
import { Image, CircularProgress } from '@chakra-ui/react';
import styled from 'styled-components';
import useFormatedTime from '../../hooks/useFormatedTime';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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
  background-color: #306172;
  color: white;
  line-height: 1.4;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #999999;
  margin-right: 10px;
`;

const Text = ({ text }) => {
  return <Content>{text}</Content>;
};

const ImageMessage = ({ url }) => {
  return (
    <Image
      objectFit='contain'
      alt="message"
      src={url}
      boxSize="100px"
      fallback={<CircularProgress isIndeterminate color='green.300' />}
    />
  );
};

const MESSAGE_TYPE = props => ({
  0: <Text text={props.message.text} />,
  1: <ImageMessage url={props.message.text} />,
});

const ChatSent = React.forwardRef((props, ref) => {
  const timeString = useFormatedTime(props.message.create_at);
  return (
    <Wrapper ref={ref}>
      <DateText>{timeString}</DateText>
      {MESSAGE_TYPE(props)[props.message.type]}
    </Wrapper>
  );
});

export default ChatSent;
