import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';

import image from '../images/notfound.png';

const ImageWrapper = styled.div`
  margin-top: 20px;
  width: 55%;
`;

const Image = styled.img`
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 4rem;
  font-weight: 700;
`;

const Content = styled.div`
  margin-top: 15px;
  font-size: 2rem;
`;

const Creditor = styled.a`
  font-size: 0.7rem;
  margin-top: 25px;
`;

const NotFound = () => {
  return (
    <Flex flexDir="column" align="center" justify="center">
      <ImageWrapper>
        <Image src={image} alt="not found" />
      </ImageWrapper>
      <Title>哎呀你是不是迷路了呢？</Title>
      <Content>請檢查看看網址是否有誤，或是點上方導覽列表回首頁</Content>
      <Creditor href="https://www.freepik.com/vectors/server-error">
        Server error vector created by storyset - www.freepik.com
      </Creditor>
    </Flex>
  );
};

export default NotFound;
