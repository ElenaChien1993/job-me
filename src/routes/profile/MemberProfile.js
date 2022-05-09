import { Button, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AlertModal from '../../components/AlertModal';

import ChatCorner from '../../components/ChatCorner';
import Loader from '../../components/Loader';
import ProfileImage from '../../components/ProfileImage';
import { device, color } from '../../style/variable';

import firebase from '../../utils/firebase';

const Container = styled.div``;

const Upper = styled.div`
  background-color: ${color.third};
  @media ${device.mobileM} {
    height: 130px;
  }
  @media ${device.tablet} {
    height: 180px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  @media ${device.mobileM} {
    top: 100px;
  }
  @media ${device.tablet} {
    top: 150px;
  }
`;

const NameWrapper = styled.div`
  color: #000000;
  margin-top: 20px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 36px;
    line-height: 36px;
  }
  @media ${device.tablet} {
    font-size: 48px;
    line-height: 65px;
  }
`;

const JobTitle = styled.div`
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 24px;
  }
  @media ${device.tablet} {
    font-size: 30px;
  }
`;

const About = styled.div`
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
  @media ${device.mobileM} {
    font-size: 18px;
  }
  @media ${device.tablet} {
    font-size: 22px;
  }
`;

const Counts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.mobileM} {
    margin: 10px 0 20px;
    & p {
      font-size: 18px;
    }
  }
  @media ${device.tablet} {
    margin: 20px 0;
    & p {
      font-size: 24px;
    }
  }
`;

const Number = styled.div`
  @media ${device.mobileM} {
    font-size: 36px;
  }
  @media ${device.tablet} {
    font-size: 50px;
  }
`;

const MemberProfile = React.memo(() => {
  const [info, setInfo] = useState(null);
  const { currentUserId, setChatOpen, setActive } = useOutletContext();
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });
  const navigate = useNavigate();
  let params = useParams();
  const uid = params.uid;

  useEffect(() => {
    if (!uid) return;
    firebase.getUser(uid).then(doc => {
      setInfo(doc.data());
    });
  }, [uid]);

  const createChat = async () => {
    if (!currentUserId) {
      onOpen();
      return;
    }
    const data = {
      members: [currentUserId, uid],
      latest: {
        timestamp: '',
      },
    };
    const roomExist = await firebase.checkIsRoomExist(data.members);
    if (roomExist.length !== 0) {
      await setActive(...roomExist);
      setChatOpen(true);
    } else {
      firebase.setChatroom(data).then(() => {
        setChatOpen(true);
      });
    }
  };

  if (!info) return <Loader />;

  return (
    <Container>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        header="請先登入"
        content="登入後才能傳送訊息給其他會員唷"
        actionText="前往登入"
        action={() => {
          navigate('/login', {
            state: { from: { pathname: `/profile/${uid}` } },
          });
        }}
      />
      <Upper />
      <InfoContainer>
        <ProfileImage user={info} size={200} hasBorder marginRight={0} />
        <NameWrapper>{info.display_name}</NameWrapper>
        <JobTitle>{info.title || '尚未提供'}</JobTitle>
        <About>{info.about_me || '尚未提供'}</About>
        <Counts>
          <Number>{info.notes_qty}</Number>
          <p>Notes</p>
        </Counts>
        <Button
          mb="50px"
          w="100px"
          variant="solid"
          colorScheme="brand"
          onClick={createChat}
        >
          傳送訊息
        </Button>
      </InfoContainer>
      {currentUserId && <ChatCorner />}
    </Container>
  );
});

export default MemberProfile;
