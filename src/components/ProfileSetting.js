import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import firebase from '../utils/firebase';
import useClickOutside from '../hooks/useClickOutside';

const Container = styled.div`
  margin: 20px 10%;
  padding: 30px 0;
  display: flex;
  height: 100%;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 5px solid #c4c4c4;
  align-items: center;
  padding-right: 60px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const ImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  border: 5px solid #ee9c91;
`;

const StyledIcon = styled(IconButton)`
  && {
    position: absolute;
    bottom: 17px;
    right: 6px;
  }
`;

const NameWrapper = styled.div`
  font-size: 48px;
  line-height: 65px;
  color: #000000;
  margin-top: 20px;
`;

const JobTitle = styled.div`
  font-size: 30px;
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
`;

const About = styled.div`
  font-size: 22px;
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
`;

const Counts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & p {
    font-size: 24px;
  }
  margin-top: 20px;
`;

const Number = styled.div`
  font-size: 50px;
  color: black;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  width: 62%;
`;

const SelectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 33px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  width: 100%;
  & label {
    margin-bottom: 10px;
    line-height: 24px;
    font-weight: 500;
  }
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  bottom: 17px;
  right: 6px;
  z-index: 0;
`;

const MenuWrapper = styled.div`
  position: absolute;
  right: -70px;
  bottom: -37px;
  width: 120px;
  height: 100px;
  background-color: white;
  box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`

const Option = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: #E3E3E3;
  }
`

const ProfileSetting = ({ uid }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [values, setValues] = useState({
    display_name: '',
    title: '',
    about_me: '',
  });
  const menuRef = useRef();

  useEffect(() => {
    const unsubscribe = firebase.listenUserProfileChange(uid, setUserInfo);

    return () => unsubscribe();
  }, [uid]);

  useClickOutside(menuRef, () => isMenuOpen && setIsMenuOpen(false))

  const handleSubmit = () => {
    const entries = Object.entries(values);
    const filtered = entries.filter((entry) => entry[1] !== '');
    const filteredObject = Object.fromEntries(filtered);
    firebase.updateUserInfo(uid, filteredObject);
    setValues({ display_name: '', title: '', about_me: '' });
  };

  return (
    <Container>
      <LeftWrapper>
        <ImageContainer>
          <ImageWrapper />
          {isMenuOpen && <MenuWrapper ref={menuRef}>
            <Option>上傳照片</Option>
            <Option>刪除照片</Option>
          </MenuWrapper>}
          <IconWrapper>
            <IconButton aria-label="Edit profile image" icon={<EditIcon />} onClick={() => setIsMenuOpen(true)}/>
          </IconWrapper>
        </ImageContainer>
        <NameWrapper>{userInfo && userInfo.display_name}</NameWrapper>
        <JobTitle>{userInfo?.title || '尚未提供'}</JobTitle>
        <About>{userInfo?.about_me || '尚未提供'}</About>
        <Counts>
          <Number>12</Number>
          <p>Notes</p>
        </Counts>
      </LeftWrapper>
      <RightWrapper>
        <SelectionWrapper>
          <SectionTitle>BASIC INFO</SectionTitle>
          <ButtonGroup colorScheme="teal" spacing="4">
            <Button
              variant="outline"
              onClick={() =>
                setValues({
                  display_name: '',
                  title: '',
                  about_me: '',
                })
              }
            >
              取消
            </Button>
            <Button variant="solid" onClick={handleSubmit}>
              變更
            </Button>
          </ButtonGroup>
        </SelectionWrapper>
        <Divider />
        <InputWrap>
          <label>名字（暱稱）</label>
          <StyledInput
            size="sm"
            value={values.display_name}
            onChange={(e) =>
              setValues((prev) => {
                return { ...prev, display_name: e.target.value };
              })
            }
          />
        </InputWrap>
        <InputWrap>
          <label>目前職稱</label>
          <StyledInput
            size="sm"
            value={values.title}
            onChange={(e) =>
              setValues((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
          />
        </InputWrap>
        <SectionTitle>ABOUT ME</SectionTitle>
        <Divider mt="10px" mb="20px" />
        <Textarea
          placeholder="請輸入簡短的自我介紹"
          value={values.about_me}
          onChange={(e) =>
            setValues((prev) => {
              return { ...prev, about_me: e.target.value };
            })
          }
        />
      </RightWrapper>
    </Container>
  );
};

export default ProfileSetting;
