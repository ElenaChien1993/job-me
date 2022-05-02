import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';
import ProfileImage from './ProfileImage';
import { device } from '../style/device';

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
  color: #000000;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 28px;
    line-height: 22px;
    margin-top: 15px;
  }
  @media ${device.tablet} {
    font-size: 48px;
    line-height: 65px;
    margin-top: 20px;
  }
`;

const JobTitle = styled.div`
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 18px;
  }
  @media ${device.tablet} {
    font-size: 30px;
  }
`;

const About = styled.div`
  color: #6c6c6c;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 16px;
    margin-top: 5px;
  }
  @media ${device.tablet} {
    font-size: 22px;
    margin-top: 10px;
  }
`;

const Counts = styled.div`
  display: flex;
  align-items: center;
  & p {
    font-size: 24px;
  }
  @media ${device.mobileM} {
    margin-top: 5px;
    flex-direction: row;
  }
  @media ${device.tablet} {
    margin-top: 20px;
    flex-direction: column;
  }
`;

const Number = styled.div`
  @media ${device.mobileM} {
    font-size: 25px;
    margin-right: 10px;
  }
  @media ${device.tablet} {
    font-size: 50px;
    margin-right: 0;
  }
`;

const TabletMode = styled.div`
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const MobileMode = styled.div`
  @media ${device.mobileM} {
    display: block;
  }
  @media ${device.tablet} {
    display: none;
  }
`;

const ProfileInfo = ({ userInfo, currentUserId }) => {
  const [image, setImage] = useState({ preview: '', raw: '' });
  const hiddenInputRef = useRef();

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

  return (
    <>
      <ImageContainer>
        <TabletMode>
          <ProfileImage
            user={userInfo}
            size={200}
            hasBorder
            marginRight={0}
            preview={image.preview}
          />
        </TabletMode>
        <MobileMode>
          <ProfileImage
            user={userInfo}
            size={120}
            hasBorder
            marginRight={0}
            preview={image.preview}
          />
        </MobileMode>
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
            right={['-10px', null, null, '0']}
            bottom={['12px', null, null, '23px']}
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
        <Number>{userInfo?.notes_qty || 0}</Number>
        <p>Notes</p>
      </Counts>
    </>
  );
};

export default ProfileInfo;
