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

const Text = React.forwardRef((props, ref) => {
  return <Content ref={ref}>{props.text}</Content>;
});

const ImageMessage = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
    <Image
      objectFit='contain'
      alt="message"
      src={props.url}
      boxSize="100px"
      fallback={<CircularProgress isIndeterminate color='green.300' />}
    />
    </div>
  );
});

const MESSAGE_TYPE = props => ({
  0: <Text text={props.message.text} ref={props.bottomRef}/>,
  1: <ImageMessage url={props.message.text} ref={props.bottomRef} />,
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
