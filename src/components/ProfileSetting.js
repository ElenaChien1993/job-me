import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Textarea,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';
import Loader from '../components/Loader';
import ChatCorner from './ChatCorner';
import ProfileImage from './ProfileImage';

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

const IconGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  right: -50px;
`;

const NameWrapper = styled.div`
  font-size: 48px;
  line-height: 65px;
  color: #000000;
  margin-top: 20px;
  text-align: center;
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
  padding-left: 50px;
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

const ProfileSetting = () => {
  const [values, setValues] = useState({
    display_name: '',
    title: '',
    about_me: '',
  });
  const [image, setImage] = useState({ preview: '', raw: '' });
  const hiddenInputRef = useRef();
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

  const handleChooseFile = e => {
    hiddenInputRef.current.click();
  };

  const handleFileChange = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUpload = async e => {
    const path = `profile/${currentUserId}`;
    const url = await firebase.uploadFile(path, image.raw).then(() => {
      return firebase.getDownloadURL(path);
    });
    firebase.updateUserInfo(currentUserId, { photo_url: url }).then(() => {
      alert('照片更新成功！');
    });
    setImage({
      preview: '',
      raw: '',
    });
  };

  const handleCancel = () => {
    setImage({
      preview: '',
      raw: '',
    });
  };

  const handleDelete = () => {
    if (
      userInfo.photo_url.includes('googleusercontent') ||
      userInfo.photo_url.includes('facebook')
    ) {
      firebase.updateUserInfo(currentUserId, { photo_url: null });
      return;
    }
    const path = `profile/${currentUserId}`;
    firebase.deleteFile(path).then(() => {
      firebase.updateUserInfo(currentUserId, { photo_url: null });
    });
  };

  if (!userInfo) return <Loader />;

  return (
    <Container>
      <LeftWrapper>
        <ImageContainer>
          <ProfileImage
            user={userInfo}
            size={200}
            hasBorder
            marginRight={0}
            preview={image.preview}
          />
          {image.preview !== '' && (
            <IconGroup>
              <IconButton
                icon={<CheckIcon />}
                aria-label="confirm upload"
                onClick={handleUpload}
              />
              <IconButton
                icon={<CloseIcon />}
                aria-label="cancel upload"
                onClick={handleCancel}
              />
            </IconGroup>
          )}
          <Menu>
            <MenuButton
              position="absolute"
              right="0"
              bottom="23px"
              as={IconButton}
              aria-label="Edit profile image"
              icon={<EditIcon />}
            />
            <MenuList>
              <MenuItem onClick={handleChooseFile}>上傳照片</MenuItem>
              <input
                type="file"
                ref={hiddenInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <MenuItem onClick={handleDelete}>刪除照片</MenuItem>
            </MenuList>
          </Menu>
        </ImageContainer>
        <NameWrapper>{userInfo && userInfo.display_name}</NameWrapper>
        <JobTitle>{userInfo?.title || '尚未提供'}</JobTitle>
        <About>{userInfo?.about_me || '尚未提供'}</About>
        <Counts>
          <Number>{userInfo?.notes_qty}</Number>
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
