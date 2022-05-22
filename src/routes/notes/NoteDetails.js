import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';

import {
  IconButton,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, AtSignIcon } from '@chakra-ui/icons';
import { MdPreview } from 'react-icons/md';
import styled from 'styled-components';

import NoteElement from '../../components/notes/NoteCardEditable';
import firebase from '../../utils/firebase';
import RecommendModal from '../../components/notes/RecommendModal';
import ChatCorner from '../../components/messages/ChatCorner';
import { device, color } from '../../style/variable';
import CompanyInfo from '../../components/notes/CompanyInfo';
import JobDetails from '../../components/notes/JobDetails';
import Preparation from '../../components/notes/Preparation';
import PersonalThought from '../../components/notes/PersonalThought';

const Background = styled.div`
  margin: 30px auto 0;
  max-width: 1000px;
  width: 90%;
  @media ${device.tablet} {
    width: 80%;
  }
`;

const Container = styled.div`
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

const PublicButtons = styled.div`
  display: flex;
  align-items: center;
  @media ${device.mobileM} {
    position: static;
    justify-content: flex-end;
  }
  position: absolute;
  right: 40px;
  top: 32px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Line = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${color.primary};
`;

const NoteDetails = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [recommend, setRecommend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const submitRef = useRef();
  const { currentUserId, setError } = useOutletContext();

  const { onOpen, isOpen, onClose } = useDisclosure({ id: 'recommend' });
  let params = useParams();
  const noteId = params.noteId;

  const tabs = ['公司資訊', '工作內容', '面試準備', '筆記心得'];
  const sections = [
    ['面試前筆記區', 'before_note'],
    ['面試中筆記區', 'ing_note'],
    ['面試後心得區', 'after_note'],
  ];

  useEffect(() => {
    let unsubscribe;
    const fetchNotes = async () => {
      try {
        const brief = await firebase.getNote(currentUserId, noteId);
        setBrief(brief.data());
        unsubscribe = firebase.listenDetailsChange(noteId, doc => {
          setDetails(doc.data());
        });
      } catch (error) {
        console.log(error);
        setError({ type: 0, message: '讀取資料發生錯誤' });
      }
    };

    fetchNotes();
    return () => unsubscribe();
  }, [currentUserId, noteId, setDetails, setError]);

  useEffect(() => {
    if (!submitRef.current) return;
    onBlurSubmit(submitRef.current.key);
  }, [submitRef.current]);

  const getObjectInArrayChangedValue = (value, index, objectKey, targetKey) => {
    const update = details[objectKey].map((item, i) =>
      index === i
        ? {
            ...item,
            [targetKey]: value,
          }
        : item
    );
    return update;
  };

  const handleMapArrayInputChange = (value, index, objectKey, targetKey) => {
    const update = getObjectInArrayChangedValue(
      value,
      index,
      objectKey,
      targetKey
    );
    setDetails(prev => {
      return { ...prev, [objectKey]: update };
    });
  };

  const onBlurSubmit = objectKey => {
    try {
      firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
    }
  };

  const handleDelete = (i, objectKey) => {
    const newData = details[objectKey].filter((_, index) => index !== i);
    setDetails(prev => {
      return { ...prev, [objectKey]: newData };
    });
    try {
      firebase.updateNoteDetails(noteId, { [objectKey]: newData });
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
    }
  };

  const showConnectModal = async () => {
    setIsLoading(true);
    onOpen();
    try {
      const members = await firebase.getRecommendedUsers(
        brief.company_name,
        brief.job_title,
        currentUserId
      );
      setRecommend(members);
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '讀取資料發生錯誤，請稍後再試' });
      onClose();
    }
    setIsLoading(false);
  };

  const openPreview = () => {
    window.open(`/public/${currentUserId}/${noteId}`, '_blank');
  };

  const togglePublic = () => {
    firebase.updateNoteBrief(currentUserId, noteId, {
      is_share: !brief.is_share,
    });
    setBrief(prev => {
      return { ...prev, is_share: !brief.is_share };
    });
  };

  return (
    <Background>
      <RecommendModal
        isOpen={isOpen}
        onClose={onClose}
        recommend={recommend}
        isLoading={isLoading}
      />
      <ButtonWrapper>
        <Link to="/notes">
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            variant="outline"
            colorScheme="brand"
          >
            回前頁
          </Button>
        </Link>
        <Button
          size="sm"
          rightIcon={<AtSignIcon />}
          variant="solid"
          colorScheme="brand"
          onClick={showConnectModal}
        >
          查看其他相關會員
        </Button>
      </ButtonWrapper>
      {brief && (
        <NoteElement
          uid={currentUserId}
          noteId={noteId}
          note={brief}
          setNote={setBrief}
          editable
        />
      )}
      {details && (
        <Container>
          <PublicButtons>
            {brief.is_share && (
              <Tooltip
                hasArrow
                label="預覽公開頁面"
                bg="gray.300"
                color="black"
              >
                <IconButton
                  color={color.primary}
                  aria-label="Open Preview"
                  icon={<MdPreview />}
                  mr="10px"
                  onClick={openPreview}
                />
              </Tooltip>
            )}
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={togglePublic}
            >
              {brief.is_share ? '公開中' : '隱藏中'}
            </Button>
          </PublicButtons>
          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList>
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
                <CompanyInfo
                  details={details}
                  setDetails={setDetails}
                  onBlurSubmit={onBlurSubmit}
                />
              </TabPanel>
              <TabPanel>
                <JobDetails
                  details={details}
                  setDetails={setDetails}
                  noteId={noteId}
                  onBlurSubmit={onBlurSubmit}
                  handleDelete={handleDelete}
                  submitRef={submitRef}
                  handleMapArrayInputChange={handleMapArrayInputChange}
                />
              </TabPanel>
              <TabPanel>
                <Preparation
                  details={details}
                  setDetails={setDetails}
                  noteId={noteId}
                  onBlurSubmit={onBlurSubmit}
                  handleDelete={handleDelete}
                  submitRef={submitRef}
                  handleMapArrayInputChange={handleMapArrayInputChange}
                />
              </TabPanel>
              <TabPanel>
                {sections.map(section => (
                  <PersonalThought
                    key={section[1]}
                    noteId={noteId}
                    details={details}
                    titleText={section[0]}
                    targetKey={section[1]}
                  />
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}
      <ChatCorner />
    </Background>
  );
};

export default NoteDetails;
