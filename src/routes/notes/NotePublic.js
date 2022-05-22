import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import {
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { AiFillEye } from 'react-icons/ai';
import styled from 'styled-components';

import ChatCorner from '../../components/messages/ChatCorner';
import Loader from '../../components/Loader';
import NoteElement from '../../components/notes/NoteCardEditable';
import ProfileImage from '../../components/ProfileImage';
import { device, color } from '../../style/variable';
import firebase from '../../utils/firebase';
import CompanyInfo from '../../components/notes/CompanyInfo';
import JobDetails from '../../components/notes/JobDetails';
import PersonalThought from '../../components/notes/PersonalThought';

const Background = styled.div`
  max-width: 1000px;
  margin: 30px auto 0;
  width: 90%;
  @media ${device.tablet} {
    width: 80%;
    margin: 30px auto 0;
  }
`;

const UpperContainer = styled.div`
  display: flex;
  border-radius: 24px;
  background-color: ${color.secondary};
  cursor: pointer;
  &:hover {
    filter: brightness(110%);
  }
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  padding: 15px 30px;
  @media ${device.tablet} {
    flex-direction: row;
    margin-bottom: 25px;
    align-items: center;
    padding: 15px 40px;
  }
`;

const Creator = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
  @media ${device.tablet} {
    margin-top: 0;
  }
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: white;
  display: flex;
  color: white;
  flex-direction: column;
  align-items: flex-start;
  @media ${device.tablet} {
    flex-direction: row;
    align-items: center;
  }
`;

const JobTitle = styled.span`
  font-weight: 500;
  font-size: 18px;
  color: white;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: ${color.white};
  margin-bottom: 60px;
  position: relative;
  padding: 20px 20px 0;
  @media ${device.tablet} {
    padding: 20px 40px 0;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${color.primary};
`;

const FieldWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  position: relative;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: ${color.primary};
  z-index: 1;
  position: relative;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${color.primary};
  margin-right: 10px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledLink = styled.a`
  margin-left: 10px;
  color: black;
  text-decoration: underline;
`;

const QuestionCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const QuestionCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background-color: ${color.third};
  position: relative;
`;

const QuestionTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const ViewsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 14px;
  right: 23px;
`;

const Views = styled.div`
  position: relative;
  top: -1.5px;
  color: #9e9ea7;
  font-weight: bold;
`;

const NotePublic = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [info, setInfo] = useState();
  const { currentUserId, setError } = useOutletContext();
  let params = useParams();
  const noteId = params.noteId;
  const uid = params.uid;

  const tabs = ['公司資訊', '工作內容', '面試準備', '筆記心得'];
  const sections = [
    ['面試前筆記區', 'before_note'],
    ['面試中筆記區', 'ing_note'],
    ['面試後心得區', 'after_note'],
  ];

  useEffect(() => {
    const fetch = async () => {
      if (currentUserId !== uid) {
        await firebase.increaseDataNumber(
          `users/${uid}/notes/${noteId}`,
          'views'
        );
      }
      try {
        const brief = await firebase.getNote(uid, noteId);
        setBrief(brief.data());
        const details = await firebase.getNoteDetails(noteId);
        setDetails(details.data());
        const user = await firebase.getUser(uid);
        setInfo(user.data());
      } catch (error) {
        console.log(error);
        setError({ type: 0, message: '讀取資料發生錯誤' });
      }
    };

    fetch();
  }, [uid, noteId, currentUserId, setError]);

  const goToProfile = id => {
    window.open(`/profile/${id}?tab=setting`, '_blank');
  };

  if (!info || !brief || !details) return <Loader />;

  return (
    <Background>
      <UpperContainer onClick={() => goToProfile(uid)}>
        <Tag mr="10px" size="lg" colorScheme="brand" borderRadius="full">
          <TagLabel color="white">作者</TagLabel>
        </Tag>
        <Creator>
          <ProfileImage
            user={info}
            size={50}
            hasBorder={false}
            marginRight={15}
          />
          <Name>
            {info.display_name} ｜
            <JobTitle>{info.title || '未提供個人職稱'}</JobTitle>
          </Name>
        </Creator>
      </UpperContainer>
      <NoteElement uid={uid} noteId={noteId} note={brief} isPublic />

      <DetailsContainer>
        <ViewsWrapper>
          <Icon color="#9e9ea7" as={AiFillEye} boxSize="20px" mr="5px" />
          <Views>{brief.views}</Views>
        </ViewsWrapper>
        <Tabs variant="soft-rounded" colorScheme="brand">
          <TabList mt={['10px', null, null, '0']}>
            {tabs.map((tab, i) => {
              return (
                <Tab
                  key={i}
                  borderRadius={['18px', null, null, 'full']}
                  p={['9px', null, null, '10px 15px']}
                  m="10px"
                  fontSize={['16px', null, null, '18px']}
                >
                  {tab}
                </Tab>
              );
            })}
          </TabList>
          <Line />
          <TabPanels>
            <TabPanel>
              <CompanyInfo isPublic details={details} />
            </TabPanel>
            <TabPanel>
              <JobDetails isPublic details={details} />
            </TabPanel>
            <TabPanel>
              {details.job_link !== '' && (
                <FieldWrapper>
                  <Title>相關準備資料連結</Title>
                  <ListItem>
                    <Dot />
                    <StyledLink href={details.job_link} target="_blank">
                      職缺連結
                    </StyledLink>
                  </ListItem>
                </FieldWrapper>
              )}
              <FieldWrapper>
                <Title>面試題目猜題</Title>
                {details.questions.length !== 0 && (
                  <QuestionCardsWrapper>
                    {details.questions.map(q => {
                      return (
                        <QuestionCard key={q.question}>
                          <QuestionTitle>{q.question}</QuestionTitle>
                        </QuestionCard>
                      );
                    })}
                  </QuestionCardsWrapper>
                )}
              </FieldWrapper>
            </TabPanel>
            <TabPanel>
              {sections.map(section => (
                <PersonalThought
                  key={section[1]}
                  isPublic
                  noteId={noteId}
                  details={details}
                  titleText={section[0]}
                  targetKey={section[1]}
                />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DetailsContainer>
      <ChatCorner />
    </Background>
  );
};

export default NotePublic;
