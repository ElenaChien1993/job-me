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

import image from '../images/log.png';
import firebase from '../utils/firebase';
import { device, color } from '../style/variable';

const WebTitle = styled.div`
  color: ${color.primary};
  font-weight: bold;
  font-size: 34px;
  margin-bottom: 20px;
  @media ${device.tablet} {
    font-size: 50px;
    margin-bottom: 40px;
  }
`;

const ImageWrapper = styled.div`
  width: 90%;
  display: none;
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

const Creditor = styled.a`
  font-size: 0.7rem;
  margin-top: 25px;
  display: none;
  @media ${device.tablet} {
    display: block;
  }
`;

const Guest = styled.div`
  position: absolute;
  top: 6px;
  right: 0;
  color: #999;
  font-size: 14px;
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
    name: false,
    email: false,
    password: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: '/' } };
  const toast = useToast();

  const REGISTER_ERROR_MESSAGE = {
    'auth/weak-password': '????????????????????????',
    'auth/email-already-in-use': '?????????????????????????????????????????????????????????',
    'auth/invalid-email': '???????????????????????????????????????????????????',
    'auth/wrong-password': '??????????????????????????????',
    'auth/user-not-found': '?????????????????????????????????????????????',
    'auth/internal-error': '??????/??????????????????????????????',
    'auth/popup-closed-by-user': '??????????????? / ??????????????????????????????',
  };

  const handleRegister = async () => {
    if (Object.values(values).some(value => !value)) {
      toast({
        title: '??????',
        description: '?????????????????????',
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
      firebase.setNewUser(user.uid, values.name);
      toast({
        title: '???????????????',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate(from);
    } catch (error) {
      toast({
        title: '??????',
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
        title: '???????????????',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate(from);
    } catch (error) {
      console.log(error);
      toast({
        title: '??????',
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
      toast({
        title: '???????????????',
        description: '???????????????????????????',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.log(error.code, error.message);
      toast({
        title: '??????',
        description: '???????????????????????????????????????',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleChange = prop => event => {
    if (prop === 'email') {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      setIsInvalid(prev => {
        return { ...prev, email: !event.target.value.match(regex) };
      });
    }
    if (prop === 'password') {
      const regex = /.{6,}/;
      setIsInvalid(prev => {
        return { ...prev, password: !event.target.value.match(regex) };
      });
    }
    if (prop === 'name') {
      setIsInvalid(prev => {
        return { ...prev, name: event.target.value === '' };
      });
    }
    setValues(prev => {
      return { ...prev, [prop]: event.target.value };
    });
  };

  return (
    <Flex
      bg={color.backgroundGray}
      justify="center"
      align="center"
      my="5%"
      px="5%"
      flexDir={['column', null, null, 'row']}
    >
      <Flex flexDir="column" w={['95%', null, null, '45%']} align="center">
        <WebTitle>Welcome To JobMe</WebTitle>
        <ImageWrapper>
          <Image src={image} alt="Login" />
        </ImageWrapper>
        <Creditor href="https://storyset.com">
          Illustrations by Storyset
        </Creditor>
      </Flex>
      <Flex
        w={['95%', null, null, '55%']}
        h="auto"
        bg="white"
        borderRadius="8px"
        flexDir="column"
        align="center"
        p="3%"
        ml={['', null, null, '5%']}
      >
        <Wrapper
          variant="ghost"
          leftIcon={<FcGoogle />}
          onClick={() => signInWithProvider('Google')}
        >
          {isRegistered ? '??? Google ????????????' : '??? Google ????????????'}
        </Wrapper>
        <Wrapper
          variant="ghost"
          leftIcon={<CgFacebook />}
          onClick={() => signInWithProvider('Facebook')}
        >
          {isRegistered ? '??? Facebook ????????????' : '??? Facebook ????????????'}
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
                <FormErrorMessage>???????????????/??????</FormErrorMessage>
              )}
            </InputGroup>
          </FormControl>
        )}
        <FormControl
          isRequired
          isInvalid={isInvalid.email}
          mt="10px"
          position="relative"
        >
          <FormLabel htmlFor="email" fontSize="20px">
            Email
          </FormLabel>
          {isRegistered && <Guest>???????????????guest@gmail.com</Guest>}
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
              <FormErrorMessage>??????????????????????????????</FormErrorMessage>
            )}
          </InputGroup>
        </FormControl>
        <FormControl isRequired isInvalid={isInvalid.password} mt="10px">
          <FormLabel htmlFor="password" fontSize="20px">
            Password
          </FormLabel>
          {isRegistered && <Guest>???????????????123456</Guest>}
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
              <FormErrorMessage>????????????????????????</FormErrorMessage>
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
          {isRegistered ? '??????' : '??????'}
        </Button>
        {isRegistered ? (
          <BottomText>
            ????????????????????????
            <StyledSpan onClick={() => setIsRegistered(false)}>??????</StyledSpan>
          </BottomText>
        ) : (
          <BottomText>
            ???????????????????????????
            <StyledSpan onClick={() => setIsRegistered(true)}>??????</StyledSpan>
          </BottomText>
        )}
      </Flex>
    </Flex>
  );
};

export default Login;
