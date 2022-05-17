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
import useRWD from '../../hooks/useRWD';
import NoteCardExplore from '../../components/NoteCardExplore';

const Container = styled.div`
  
`;

const Upper = styled.div`
  background-color: ${color.third};
  height: 130px;
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
  width: 90%;
  padding-bottom: 40px;
  transform: translate(-50%, 0);
  top: 135px;
  @media ${device.tablet} {
    top: 160px;
    width: 80%;
  }
`;

const NameWrapper = styled.div`
  color: #000000;
  margin-top: 20px;
  text-align: center;
  font-size: 30px;
  line-height: 36px;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const JobTitle = styled.div`
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
  font-size: 22px;
  @media ${device.tablet} {
    font-size: 24px;
  }
`;

const About = styled.div`
  color: #6c6c6c;
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
  @media ${device.tablet} {
    font-size: 18px;
  }
`;

const Counts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 20px;
  & p {
    font-size: 18px;
  }
  @media ${device.tablet} {
    & p {
      font-size: 24px;
    }
  }
`;

const Number = styled.div`
  font-size: 36px;
  @media ${device.tablet} {
    font-size: 50px;
  }
`;

const Line = styled.hr`
  height: 1px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 1260px;
`;

const SectionTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: ${color.primary};
  margin-top: 20px;
`;

const ContentGrid = styled.ol`
  display: grid;
  grid-gap: 15px 30px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  list-style: none;
  width: 100%;
  margin: 20px 0;
  @media ${device.mobileM} {
    padding: 0 20px;
  }
  @media ${device.table} {
    padding: 0 32px;
  }
  @media ${device.laptop} {
    padding: 0 10%;
  }
`;

const MemberProfile = React.memo(() => {
  const [info, setInfo] = useState(null);
  const [notes, setNotes] = useState(null);
  const { currentUserId, setChatOpen, setActive } = useOutletContext();
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });
  const navigate = useNavigate();
  let params = useParams();
  const uid = params.uid;

  const isMobile = useRWD();

  useEffect(() => {
    if (!uid) return;
    firebase.getUser(uid).then(doc => {
      setInfo(doc.data());
    });
    firebase.getPersonalPublicNotes(uid).then(data => setNotes(data));
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
        <ProfileImage
          user={info}
          size={isMobile ? 120 : 160}
          hasBorder
          marginRight={0}
        />
        <NameWrapper>{info.display_name}</NameWrapper>
        <JobTitle>{info.title || '尚未提供'}</JobTitle>
        <About>{info.about_me || '尚未提供'}</About>
        <Button
          mt="20px"
          w="100px"
          variant="solid"
          colorScheme="brand"
          onClick={createChat}
        >
          傳送訊息
        </Button>
        <Counts>
          <Number>{info.notes_qty}</Number>
          <p>Notes</p>
        </Counts>
        <Line />
        {notes && (
          <>
            <SectionTitle>公開筆記</SectionTitle>
            <ContentGrid>
              {notes.map(note => (
                <NoteCardExplore key={note.note_id} note={note} isProfile />
              ))}
            </ContentGrid>
          </>
        )}
      </InfoContainer>
      {currentUserId && <ChatCorner />}
    </Container>
  );
});

export default MemberProfile;
