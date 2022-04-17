import styled from 'styled-components';

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

const ChatSent = ({ text }) => {
  return (
    <Wrapper>
      <Content>{text}</Content>
    </Wrapper>
  );
};

export default ChatSent;
