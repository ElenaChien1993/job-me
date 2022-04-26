import { useState } from 'react';
import {
  Flex,
  IconButton,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { CgFacebook } from 'react-icons/cg';
import {
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsPersonFill,
} from 'react-icons/bs';
import styled from 'styled-components';

import image from '../images/login.png';

const WebTitle = styled.div`./
  color: #306172;
  font-weight: bold;
  font-size: 50px;
  margin-bottom: 40px;
`;

const ImageWrapper = styled.div`
  width: 90%;
`;

const Image = styled.img`
  object-fit: cover;
`;

const Wrapper = styled(Button)`
  && {
    width: 100%;
    height: 50px;
    padding: 10px 0;
    font-size: 18px;
    box-shadow: 0px 4px 15px rgb(0 0 0 / 11%);
    margin-bottom: 20px;
  }
`;

const Text = styled.div`
  font-size: 20px;
  margin: 0 10px;
`;

const DividerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 16px;
  color: black;
  margin: 20px 0;
  cursor: default;
`;

const StyledSpan = styled.span`
  color: #ee9c91;
  font-weight: bold;
  cursor: pointer;
`;

const Login2 = () => {
  const [show, setShow] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const handleClick = () => setShow(!show);

  return (
    <Flex bg="#ffeade" justify="center" align="center" my="5%" px="5%">
      <Flex flexDir="column" w="45%" align="center">
        <WebTitle>Welcome To JobMe</WebTitle>
        <ImageWrapper>
          <Image src={image} alt="Login" />
        </ImageWrapper>
      </Flex>
      <Flex
        w="55%"
        h="auto"
        bg="white"
        borderRadius="8px"
        flexDir="column"
        align="center"
        p="3%"
        ml="5%"
      >
        <Wrapper variant="ghost" leftIcon={<FcGoogle />}>
          {isRegistered ? '用 Google 帳號登入' : '用 Google 帳號註冊'}
        </Wrapper>
        <Wrapper variant="ghost" leftIcon={<CgFacebook />}>
          {isRegistered ? '用 Facebook 帳號登入' : '用 Facebook 帳號註冊'}
        </Wrapper>
        <DividerWrapper>
          <Divider />
          <Text>OR</Text>
          <Divider />
        </DividerWrapper>
        {!isRegistered && (
          <FormControl isRequired mt="10px">
            <FormLabel htmlFor="name" fontSize="20px">
              Name
            </FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<BsPersonFill color="gray.500" w="20px" h="20px" />}
              />
              <Input
                id="name"
                placeholder="Enter your name"
                variant="filled"
              />
            </InputGroup>
          </FormControl>
        )}
        <FormControl isRequired mt="10px">
          <FormLabel htmlFor="email" fontSize="20px">
            Email
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="gray.500" w="20px" h="20px" />}
            />
            <Input
              id="email"
              placeholder="example.gmail.com"
              variant="filled"
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired mt="10px">
          <FormLabel htmlFor="password" fontSize="20px">
            Password
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<LockIcon color="gray.500" w="20px" h="20px" />}
            />
            <Input
              id="password"
              placeholder="Enter your password"
              variant="filled"
              type={show ? 'text' : 'password'}
            />
            <InputRightElement mr="5px">
              <IconButton
                size="xs"
                onClick={handleClick}
                as={show ? BsFillEyeSlashFill : BsFillEyeFill}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          w="100%"
          mt="30px"
          py="5px"
          _hover={{ filter: 'auto', brightness: '90%' }}
          bgColor="#F5CDC5"
        >
          {isRegistered ? '登入' : '註冊'}
        </Button>
        {isRegistered ? <BottomText>
          尚未有帳號？請先<StyledSpan onClick={() => setIsRegistered(false)}>註冊</StyledSpan>
        </BottomText> : <BottomText>
          已經有帳號？請前往<StyledSpan onClick={() => setIsRegistered(true)}>登入</StyledSpan>
        </BottomText>}
      </Flex>
    </Flex>
  );
};

export default Login2;
