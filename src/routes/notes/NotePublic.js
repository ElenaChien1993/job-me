import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import EditorArea from '../../components/elements/Editor';

import Loader from '../../components/Loader';
import NoteElement from '../../components/NoteCardEditable';
import ProfileImage from '../../components/ProfileImage';
import { device } from '../../style/device';
import firebase from '../../utils/firebase';

const Background = styled.div`
  @media ${device.mobileM} {
    margin: 30px 5% 0;
  }
  @media ${device.tablet} {
    margin: 30px 10% 0;
  }
`;

const UpperContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 24px;
  background-color: #ee9c91;
  padding: 15px 40px;
  cursor: pointer;
  &:hover {
    filter: brightness(110%);
  }
  @media ${device.mobileM} {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  @media ${device.tablet} {
    flex-direction: row;
    margin-bottom: 25px;
  }
`;

const Creator = styled.div`
  display: flex;
  @media ${device.mobileM} {
    margin-top: 10px;
  }
  @media ${device.tablet} {
    margin-top: 0;
  }
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: black;
  display: flex;
  align-items: center;
`;

const JobTitle = styled.span`
  font-weight: 500;
  font-size: 18px;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: white;
  margin-bottom: 60px;
  @media ${device.mobileM} {
    padding: 20px 20px 0;
  }
  @media ${device.tablet} {
    padding: 20px 40px 0;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 5px;
  background-color: #306172;
`;

const FieldWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  position: relative;
`;

const Title = styled.p`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #306172;
  z-index: 1;
  position: relative;
`;

const TitleSection = styled.div`
  position: relative;
`;

const TitleBack = styled.div`
  height: 13px;
  position: absolute;
  top: 18px;
  left: 0;
  background-color: #fff6c9;
  z-index: 0;
  width: 100%;
`;

const Content = styled.div`
  font-size: 1.1rem;
`;

const ListWrapper = styled.div`
  width: 100%;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #306172;
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
  background-color: #fff6c9;
  position: relative;
`;

const QuestionTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const NotePublic = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [info, setInfo] = useState();
  let params = useParams();
  const noteId = params.noteId;
  const uid = params.uid;

  const tabs = ['公司資訊', '工作內容', '面試準備', '筆記心得'];

  useEffect(() => {
    firebase.getNote(uid, noteId).then(snap => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then(snap => {
      setDetails(snap.data());
    });
    firebase.getUser(uid).then(doc => {
      setInfo(doc.data());
    });
  }, [uid, noteId]);

  const goToProfile = id => {
    window.open(`/profile/${id}`, '_blank');
  };

  if (!info || !brief || !details) return <Loader />;

  return (
    <Background>
      <UpperContainer onClick={() => goToProfile(uid)}>
        <Tag mr="10px" size="lg" colorScheme="red" borderRadius="full">
          <TagLabel>作者</TagLabel>
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
      {brief && <NoteElement uid={uid} noteId={noteId} note={brief} isPublic />}
      {details && (
        <DetailsContainer>
          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList>
              {tabs.map((tab, i) => {
                return (
                  <Tab
                    key={i}
                    borderRadius={['18px', null, null, 'full']}
                    p={['9px', null, null, '10px']}
                    m="10px"
                    fontSize={['16px', null, null, '20px']}
                  >
                    {tab}
                  </Tab>
                );
              })}
            </TabList>
            <Line />
            <TabPanels>
              <TabPanel>
                <FieldWrapper>
                  <Title>公司主要產品 / 服務</Title>
                  <Content>
                    {details.product === '' ? '未填寫' : details.product}
                  </Content>
                </FieldWrapper>
                <FieldWrapper>
                  <Title>薪資範圍</Title>
                  <Content>
                    {`${
                      details.salary.range === ''
                        ? '未填寫'
                        : details.salary.range
                    } K(千) ${details.salary.type}`}
                  </Content>
                </FieldWrapper>
              </TabPanel>
              <TabPanel>
                <FieldWrapper>
                  <TitleSection>
                    <Title>工作內容</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.responsibilities.length === 0
                      ? '未填寫'
                      : details.responsibilities.map((item, i) => {
                          return (
                            <ListItem key={uuid()}>
                              <Dot />
                              <Content>{item}</Content>
                            </ListItem>
                          );
                        })}
                  </ListWrapper>
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>必備技能</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.requirements.length === 0
                      ? '未填寫'
                      : details.requirements.map((item, i) => {
                          return (
                            <ListItem key={uuid()}>
                              <Dot />
                              <Content>{item.description}</Content>
                            </ListItem>
                          );
                        })}
                  </ListWrapper>
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>加分項目</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.bonus.length === 0
                      ? '未填寫'
                      : details.bonus.map((item, i) => {
                          return (
                            <ListItem key={uuid()}>
                              <Dot />
                              <Content>{item.description}</Content>
                            </ListItem>
                          );
                        })}
                  </ListWrapper>
                </FieldWrapper>
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
                      {details.questions.map((q, i) => {
                        return (
                          <QuestionCard key={uuid()}>
                            <QuestionTitle>{q.question}</QuestionTitle>
                          </QuestionCard>
                        );
                      })}
                    </QuestionCardsWrapper>
                  )}
                </FieldWrapper>
              </TabPanel>
              <TabPanel>
                <FieldWrapper>
                  <TitleSection>
                    <Title>面試前筆記區</Title>
                    <TitleBack />
                  </TitleSection>
                  <EditorArea
                    isPublic
                    noteId={noteId}
                    details={details}
                    objectKey="before_note"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>面試中筆記區</Title>
                    <TitleBack />
                  </TitleSection>
                  <EditorArea
                    isPublic
                    noteId={noteId}
                    details={details}
                    objectKey="ing_note"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>面試後心得區</Title>
                    <TitleBack />
                  </TitleSection>
                  <EditorArea
                    isPublic
                    noteId={noteId}
                    details={details}
                    objectKey="after_note"
                  />
                </FieldWrapper>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DetailsContainer>
      )}
    </Background>
  );
};

export default NotePublic;
