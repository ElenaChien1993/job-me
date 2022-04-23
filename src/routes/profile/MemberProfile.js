import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import styled from 'styled-components';

import ChatCorner from '../../components/ChatCorner';
import Loader from '../../components/Loader';
import ProfileImage from '../../components/ProfileImage';

import firebase from '../../utils/firebase';

const Container = styled.div`
  padding-top: 70px;
`;

const Upper = styled.div`
  background-color: #f5cdc5;
  height: 250px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 220px;
  left: 50%;
  transform: translate(-50%, 0);
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
  margin-bottom: 20px;
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

const MemberProfile = React.memo(() => {
  const [info, setInfo] = useState(null);
  const { currentUserId, setChatOpen, setActive } = useOutletContext();
  let params = useParams();
  const uid = params.uid;

  useEffect(() => {
    if (!uid) return;
    firebase.getUser(uid).then(doc => {
      setInfo(doc.data());
    });
  }, [uid]);

  const createChat = async () => {
    const data = {
      members: [currentUserId, uid],
      latest_timestamp: '',
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
      <Upper></Upper>
      <InfoContainer>
        <ProfileImage user={info} size={200} hasBorder marginRight={0} />
        <NameWrapper>{info.display_name}</NameWrapper>
        <JobTitle>{info.title || '尚未提供'}</JobTitle>
        <About>{info.about_me || '尚未提供'}</About>
        <Counts>
          <Number>12</Number>
          <p>Notes</p>
        </Counts>
        <Button
          mb="50px"
          w="100px"
          variant="solid"
          colorScheme="teal"
          onClick={createChat}
        >
          傳送訊息
        </Button>
      </InfoContainer>
      <ChatCorner />
    </Container>
  );
});

export default MemberProfile;
