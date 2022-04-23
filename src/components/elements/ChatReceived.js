import React from 'react';
import styled from 'styled-components';
import ProfileImage from '../ProfileImage';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-top: 10px;
`;

const ImageWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #f5cdc5;
  margin-right: 16px;
`;

const Content = styled.div`
  background: #f5f5f5;
  border-radius: 15px;
  padding: 10px 20px;
  max-width: 55%;
  line-height: 1.4;
`;

const ChatReceived = React.forwardRef((props, ref) => {
  return (
    <Wrapper ref={ref}>
      <ProfileImage
        user={props.member}
        size={48}
        hasBorder={false}
        marginRight={16}
      />
      <Content>{props.text}</Content>
    </Wrapper>
  );
});

export default ChatReceived;
