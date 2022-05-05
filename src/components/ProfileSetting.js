import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Textarea,
} from '@chakra-ui/react';

import styled from 'styled-components';

import firebase from '../utils/firebase';
import Loader from '../components/Loader';
import ChatCorner from './ChatCorner';
import { device, color } from '../style/variable';
import ProfileInfo from './ProfileInfo';

const Container = styled.div`
  margin: 20px 0;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${device.mobileM} {
    flex-direction: column;
  }
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const LeftWrapper = styled.div`
  flex-direction: column;
  align-items: center;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: flex;
    border-right: 5px solid #c4c4c4;
    padding-right: 60px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${device.mobileM} {
    margin-top: 230px;
    width: 100%;
  }
  @media ${device.tablet} {
    margin-top: 0;
    padding-left: 50px;
    width: 62%;
  }
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
  width: 100%;
  & label {
    margin-bottom: 10px;
    line-height: 24px;
    font-weight: 500;
  }
  @media ${device.mobileM} {
    padding: 10px 0;
  }
  @media ${device.tablet} {
    padding: 16px 0;
  }
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const ProfileSetting = () => {
  const [values, setValues] = useState({
    display_name: '',
    title: '',
    about_me: '',
  });
  const { userInfo, currentUserId } = useOutletContext();

  const handleSubmit = () => {
    const entries = Object.entries(values);
    const filtered = entries.filter(entry => entry[1] !== '');
    const filteredObject = Object.fromEntries(filtered);
    firebase.updateUserInfo(currentUserId, filteredObject);
    if (filteredObject.display_name) {
      firebase.updateUser(filteredObject.display_name);
    }
    setValues({ display_name: '', title: '', about_me: '' });
  };

  if (!userInfo) return <Loader />;

  return (
    <Container>
      <LeftWrapper>
        <ProfileInfo userInfo={userInfo} currentUserId={currentUserId} />
      </LeftWrapper>
      <RightWrapper>
        <SelectionWrapper>
          <SectionTitle>BASIC INFO</SectionTitle>
          <ButtonGroup colorScheme="brand" spacing="4">
            <Button
              variant="outline"
              color={color.mainGreen}
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
            onChange={e =>
              setValues(prev => {
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
            onChange={e =>
              setValues(prev => {
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
          onChange={e =>
            setValues(prev => {
              return { ...prev, about_me: e.target.value };
            })
          }
        />
      </RightWrapper>
      <ChatCorner />
    </Container>
  );
};

export default ProfileSetting;
