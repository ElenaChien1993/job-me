import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  FormErrorMessage,
  useToast,
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
import firebase from '../utils/firebase';
import { device, color } from '../style/variable';

const WebTitle = styled.div`
  color: ${color.primary};
  font-weight: bold;
  @media ${device.mobileM} {
    font-size: 34px;
    margin-bottom: 20px;
  }
  @media ${device.tablet} {
    font-size: 50px;
    margin-bottom: 40px;
  }
`;

const ImageWrapper = styled.div`
  width: 90%;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
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
  color: ${color.secondary};
  font-weight: bold;
  cursor: pointer;
`;

const Login = () => {
  const [show, setShow] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isInvalid, setIsInvalid] = useState({
    name: true,
    email: true,
    password: true,
  });
  const navigate = useNavigate();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: '/' } };
  const toast = useToast();

  const REGISTER_ERROR_MESSAGE = {
    'auth/weak-password': '密碼需大於六位數',
    'auth/email-already-in-use': '此信箱已是會員，請點下方切換為登入頁面',
    'auth/invalid-email': '信箱格式錯誤，請填寫正確的信箱格式',
    'auth/wrong-password': '密碼錯誤，請重新輸入',
    'auth/user-not-found': '查無此信箱帳號非會員，請先註冊',
    'auth/internal-error': '登入/註冊失敗，請稍後再試',
    'auth/popup-closed-by-user': '未完成登入 / 註冊流程，請再試一次',
  };

  const handleRegister = async () => {
    if (Object.values(values).some(value => !value)) {
      toast({
        title: '哎呀',
        description: '請填寫所有欄位',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    try {
      const user = await firebase.register(values.email, values.password);
      firebase.updateUser(values.name);
      firebase.signUp(user.uid, values.name);
      toast({
        title: '註冊成功！',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate(from);
    } catch (error) {
      toast({
        title: '哎呀',
        description: REGISTER_ERROR_MESSAGE[error.code],
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleSignIn = async () => {
    try {
      await firebase.signIn(values.email, values.password);
      toast({
        title: '歡迎回來！',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate(from);
    } catch (error) {
      console.log(error);
      toast({
        title: '哎呀',
        description: REGISTER_ERROR_MESSAGE[error.code],
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const signInWithProvider = async provider => {
    try {
      await firebase.signInWithProvider(provider);
      console.log('login');
      toast({
        title: '成功登入！',
        description: '已為您自動導向首頁',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.log(error.code, error.message);
    }
  };

  const handleChange = prop => event => {

    setValues(prev => {
      return { ...prev, [prop]: event.target.value };
    });
    setIsInvalid(prev => {
      return { ...prev, [prop]: event.target.value === '' };
    });
  };

  return (
    <Flex
      bg={color.demoBackground}
      justify="center"
      align="center"
      my="5%"
      px="5%"
      flexDir={['column', null, null, 'row']}
    >
      <Flex flexDir="column" w={["95%", null, null, "45%"]} align="center">
        <WebTitle>Welcome To JobMe</WebTitle>
        <ImageWrapper>
          <Image src={image} alt="Login" />
        </ImageWrapper>
      </Flex>
      <Flex
        w={["95%", null, null, "55%"]}
        h="auto"
        bg="white"
        borderRadius="8px"
        flexDir="column"
        align="center"
        p="3%"
        ml={["", null, null, "5%"]}
      >
        <Wrapper
          variant="ghost"
          leftIcon={<FcGoogle />}
          onClick={() => signInWithProvider('Google')}
        >
          {isRegistered ? '用 Google 帳號登入' : '用 Google 帳號註冊'}
        </Wrapper>
        <Wrapper
          variant="ghost"
          leftIcon={<CgFacebook />}
          onClick={() => signInWithProvider('Facebook')}
        >
          {isRegistered ? '用 Facebook 帳號登入' : '用 Facebook 帳號註冊'}
        </Wrapper>
        <DividerWrapper>
          <Divider />
          <Text>OR</Text>
          <Divider />
        </DividerWrapper>
        {!isRegistered && (
          <FormControl isRequired isInvalid={isInvalid.name} mt="10px">
            <FormLabel htmlFor="name" fontSize="20px">
              Name
            </FormLabel>
            <InputGroup flexDir="column">
              <InputLeftElement
                pointerEvents="none"
                children={<BsPersonFill color="gray.500" w="20px" h="20px" />}
              />
              <Input
                value={values.name}
                onChange={handleChange('name')}
                id="name"
                placeholder="Enter your name"
                variant="filled"
              />
              {isInvalid.name && (
                <FormErrorMessage>請填寫名字/暱稱</FormErrorMessage>
              )}
            </InputGroup>
          </FormControl>
        )}
        <FormControl isRequired isInvalid={isInvalid.email} mt="10px">
          <FormLabel htmlFor="email" fontSize="20px">
            Email
          </FormLabel>
          <InputGroup flexDir="column">
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="gray.500" w="20px" h="20px" />}
            />
            <Input
              value={values.email}
              onChange={handleChange('email')}
              id="email"
              placeholder="example.gmail.com"
              variant="filled"
            />
            {isInvalid.email && (
              <FormErrorMessage>請填寫正確的信箱格式</FormErrorMessage>
            )}
          </InputGroup>
        </FormControl>
        <FormControl isRequired isInvalid={isInvalid.password} mt="10px">
          <FormLabel htmlFor="password" fontSize="20px">
            Password
          </FormLabel>
          <InputGroup flexDir="column">
            <InputLeftElement
              pointerEvents="none"
              children={<LockIcon color="gray.500" w="20px" h="20px" />}
            />
            <Input
              value={values.password}
              onChange={handleChange('password')}
              id="password"
              placeholder="Enter your password"
              variant="filled"
              type={show ? 'text' : 'password'}
            />
            {isInvalid.password && (
              <FormErrorMessage>密碼請大於六位數</FormErrorMessage>
            )}
            <InputRightElement mr="5px">
              <IconButton
                cursor="pointer"
                size="xs"
                onClick={() => setShow(!show)}
                as={show ? BsFillEyeSlashFill : BsFillEyeFill}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          onClick={isRegistered ? handleSignIn : handleRegister}
          w="100%"
          mt="30px"
          py="5px"
          _hover={{ filter: 'auto', brightness: '90%' }}
          bgColor={color.secondary}
          color="white"
        >
          {isRegistered ? '登入' : '註冊'}
        </Button>
        {isRegistered ? (
          <BottomText>
            尚未有帳號？請先
            <StyledSpan onClick={() => setIsRegistered(false)}>註冊</StyledSpan>
          </BottomText>
        ) : (
          <BottomText>
            已經有帳號？請前往
            <StyledSpan onClick={() => setIsRegistered(true)}>登入</StyledSpan>
          </BottomText>
        )}
      </Flex>
    </Flex>
  );
};

export default Login;
