import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Divider,
  IconButton,
  Icon,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FaMicrophone, FaFilm } from 'react-icons/fa';
import { RiFileUnknowLine } from 'react-icons/ri';
import styled from 'styled-components';

import ChatCorner from './ChatCorner';
import firebase from '../utils/firebase';
import { MdSaveAlt } from 'react-icons/md';
import { color, device } from '../style/variable';
import ProfileMobileRecords from './ProfileMobileRecords';
import AlertModal from './AlertModal';
import Loader from './Loader';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media ${device.mobileM} {
    padding: 20px 0 0;
    margin-bottom: 40px;
    flex-direction: column;
    align-items: center;
  }
  @media ${device.tablet} {
    margin: 0 0 20px;
    padding: 30px 0;
    flex-direction: row;
    align-items: flex-start;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.mobileM} {
    border-right: none;
    padding-right: 0;
    width: 100%;
  }
  @media ${device.tablet} {
    border-right: 5px solid #c4c4c4;
    padding-right: 20px;
    width: auto;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${device.mobileM} {
    width: 100%;
    padding-left: 0;
    margin-top: 20px;
  }
  @media ${device.tablet} {
    width: 60%;
    padding-left: 50px;
    margin-top: 0;
  }
`;

const RecordsList = styled.div`
  width: 100%;
  height: 500px;
  background: #ffffff;
  border-radius: 20px;
  overflow: scroll;
  padding: 10px 0;
`;

const Record = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 20px;
  padding-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #dbdbdb;
  color: ${props => (props.isSelected ? 'black' : '#999999')};
  font-weight: ${props => (props.isSelected ? '700' : '400')};
  &:hover {
    font-weight: 700;
    color: black;
  }
  & h2 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media ${device.mobileM} {
      font-size: 16px;
    }
    @media ${device.tablet} {
      font-size: 18px;
    }
  }
  & p {
    text-align: end;
    max-width: 20%;
    @media ${device.mobileM} {
      font-size: 14px;
    }
    @media ${device.tablet} {
      font-size: 16px;
    }
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

const Reminder = styled.div`
  color: red;
  font-size: 20px;
  text-align: center;
  margin-top: 30px;
`;

const Text = styled.div`
  margin: 0 20px;
  font-size: 20px;
  text-align: center;
`;

const NoFileWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledAudio = styled.audio`
  width: 100%;
  border-radius: 30px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
`;

const ProfileRecords = ({ isMobile }) => {
  const [audioRecords, setAudioRecords] = useState(null);
  const [videoRecords, setVideoRecords] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { currentUserId } = useOutletContext();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenUserRecordsChange(
      currentUserId,
      setAudioRecords,
      setVideoRecords
    );

    return unsubscribe;
  }, [currentUserId]);

  useEffect(() => {
    if (!audioRecords || !videoRecords) return;
    setActiveAudio(audioRecords[0]);
    setActiveVideo(videoRecords[0]);
  }, [audioRecords, videoRecords]);

  const handleDownload = async (url, name) => {
    const record = await fetch(url);
    const recordBlob = await record.blob();
    const recordURL = URL.createObjectURL(recordBlob);

    const anchor = document.createElement('a');
    anchor.href = recordURL;
    anchor.download = name;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(recordURL);
  };

  const handleDelete = async () => {
    let path;
    if (tabIndex === 0) {
      path = `audios/${currentUserId}/${activeAudio.record_job}/${activeAudio.record_name}-${activeAudio.record_id}`;
    } else {
      path = `videos/${currentUserId}/${activeVideo.record_job}/${activeVideo.record_name}-${activeVideo.record_id}`;
    }
    await firebase.deleteFile(path);
    await firebase.deleteData(
      `users/${currentUserId}/records/${
        tabIndex === 0 ? activeAudio.record_id : activeVideo.record_id
      }`
    );
    toast({
      title: '成功',
      description: '檔案已刪除',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  if (!audioRecords || !videoRecords) return <Loader />;

  return (
    <Container>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        header="刪除紀錄"
        content="紀錄一經刪除便無法回復，確認要刪除嗎？"
        actionText="刪除"
        action={handleDelete}
      />
      {isMobile ? (
        <ProfileMobileRecords onOpen={onOpen} />
      ) : (
        <>
          <LeftWrapper>
            <Tabs
              w={['100%', null, null, 'auto']}
              isFitted
              orientation="vertical"
              variant="soft-rounded"
              colorScheme="brand"
              size="lg"
              onChange={index => setTabIndex(index)}
            >
              <TabList>
                <Tab px={['5px', null, null, '1rem']}>
                  <FaMicrophone />
                </Tab>
                <Tab px={['5px', null, null, '1rem']}>
                  <FaFilm />
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel
                  pr={[0, null, null, '1rem']}
                  pt={[0, null, null, '1rem']}
                >
                  <RecordsList>
                    {audioRecords.length !== 0 ? (
                      audioRecords.map(record => {
                        return (
                          <Record
                            key={record.record_id}
                            isSelected={
                              activeAudio &&
                              activeAudio.record_id === record.record_id
                            }
                            onClick={() => setActiveAudio(record)}
                          >
                            <h2>{record.record_job}</h2>
                            <p>{record.date}</p>
                          </Record>
                        );
                      })
                    ) : (
                      <Text>尚無錄音練習紀錄</Text>
                    )}
                  </RecordsList>
                </TabPanel>
                <TabPanel>
                  <RecordsList>
                    {videoRecords.length !== 0 ? (
                      videoRecords.map(record => {
                        return (
                          <Record
                            key={record.record_id}
                            isSelected={
                              activeVideo &&
                              activeVideo.record_id === record.record_id
                            }
                            onClick={() => setActiveVideo(record)}
                          >
                            <h2>{record.record_job}</h2>
                            <p>{record.date}</p>
                          </Record>
                        );
                      })
                    ) : (
                      <Text>尚無錄影練習紀錄</Text>
                    )}
                  </RecordsList>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </LeftWrapper>
          <RightWrapper>
            {(tabIndex === 0 && !activeAudio) ||
            (tabIndex === 1 && !activeVideo) ? (
              <NoFileWrapper>
                <Icon
                  w="200px"
                  h="200px"
                  color="#A0AEC0"
                  as={RiFileUnknowLine}
                />
                <Text>無紀錄可顯示，請先至練習頁面練習</Text>
              </NoFileWrapper>
            ) : (
              <>
                <SelectionWrapper>
                  <SectionTitle>
                    {tabIndex === 0
                      ? activeAudio?.record_name
                      : activeVideo?.record_name}
                  </SectionTitle>
                  <Button
                    variant="outline"
                    borderColor={color.primary}
                    color={color.primary}
                    onClick={onOpen}
                  >
                    刪除
                  </Button>
                </SelectionWrapper>
                <Divider mb="20px" />
                {tabIndex === 0 ? (
                  <StyledAudio
                    src={activeAudio?.link}
                    controls
                    style={{ width: '100%' }}
                  />
                ) : (
                  <video src={activeVideo?.link} controls />
                )}
                <IconButton
                  isRound
                  color="white"
                  bg={color.primary}
                  aria-label="Save Recording"
                  fontSize="20px"
                  _hover={{ filter: 'brightness(150%)' }}
                  onClick={() =>
                    handleDownload(
                      tabIndex === 0 ? activeAudio?.link : activeVideo?.link,
                      tabIndex === 0
                        ? activeAudio?.record_name
                        : activeVideo?.record_name
                    )
                  }
                  icon={<MdSaveAlt />}
                  mt="20px"
                />
                <Reminder>檔案刪除後就無法再讀取，請記得先下載</Reminder>
              </>
            )}
          </RightWrapper>
        </>
      )}
      <ChatCorner />
    </Container>
  );
};

export default ProfileRecords;
