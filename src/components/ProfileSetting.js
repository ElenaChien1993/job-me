import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import firebase from '../utils/firebase';

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

const NameInputWrapper = styled.div`
  display: flex;
  align-items: center;
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

const ProfileSetting = ({ uid }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    aboutMe: '',
  });

  useEffect(() => {
    firebase.getUser(uid).then((user) => setUserInfo(user.data()));
  }, []);

  console.log(values);
  return (
    <Container>
      <LeftWrapper>
        <ImageContainer>
          <ImageWrapper />
          <StyledIcon aria-label="Edit profile image" icon={<EditIcon />} />
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
                  firstName: '',
                  lastName: '',
                  jobTitle: '',
                  aboutMe: '',
                })
              }
            >
              取消
            </Button>
            <Button variant="solid">變更</Button>
          </ButtonGroup>
        </SelectionWrapper>
        <Divider />
        <NameInputWrapper>
          <InputWrap>
            <label>名字</label>
            <StyledInput
              size="sm"
              value={values.firstName}
              onChange={(e) =>
                setValues((prev) => {
                  return { ...prev, firstName: e.target.value };
                })
              }
            />
          </InputWrap>
          <InputWrap>
            <label>姓氏</label>
            <StyledInput
              size="sm"
              value={values.lastName}
              onChange={(e) =>
                setValues((prev) => {
                  return { ...prev, lastName: e.target.value };
                })
              }
            />
          </InputWrap>
        </NameInputWrapper>
        <InputWrap>
          <label>目前職稱</label>
          <StyledInput
            size="sm"
            value={values.jobTitle}
            onChange={(e) =>
              setValues((prev) => {
                return { ...prev, jobTitle: e.target.value };
              })
            }
          />
        </InputWrap>
        <SectionTitle>ABOUT ME</SectionTitle>
        <Divider mt="10px" mb="20px" />
        <Textarea
          placeholder="請輸入簡短的自我介紹"
          value={values.aboutMe}
          onChange={(e) =>
            setValues((prev) => {
              return { ...prev, aboutMe: e.target.value };
            })
          }
        />
      </RightWrapper>
    </Container>
  );
};

export default ProfileSetting;
