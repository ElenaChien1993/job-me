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
} from '@chakra-ui/react';
import { FaMicrophone, FaFilm } from 'react-icons/fa';
import { RiFileUnknowLine } from 'react-icons/ri';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import ChatCorner from './ChatCorner';
import firebase from '../utils/firebase';
import { MdSaveAlt } from 'react-icons/md';

const Container = styled.div`
  margin: 20px 0;
  padding: 30px 0;
  display: flex;
  justify-content: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 5px solid #c4c4c4;
  align-items: center;
  padding-right: 20px;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  width: 60%;
`;

const RecordsList = styled.div`
  width: 100%;
  height: 500px;
  padding-top: 20px;
  background: #ffffff;
  border-radius: 20px;
  overflow: scroll;
`;

const Record = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => (props.isSelected ? 'black' : '#999999')};
  font-weight: ${props => (props.isSelected ? '700' : '400')};
  &:hover {
    font-weight: 700;
    color: black;
  }
  & h2 {
    font-size: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & p {
    font-size: 18px;
    text-align: end;
    max-width: 20%;
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
`;

const NoFileWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ProfileRecords = () => {
  const [audioRecords, setAudioRecords] = useState([]);
  const [videoRecords, setVideoRecords] = useState([]);
  const [activeAudio, setActiveAudio] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { currentUserId } = useOutletContext();

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

  const handleDelete = () => {
    let path;
    if (tabIndex === 0) {
      path = `audios/${currentUserId}/${activeAudio.record_job}/${activeAudio.record_name}-${activeAudio.record_id}`;
    } else {
      path = `videos/${currentUserId}/${activeVideo.record_job}/${activeVideo.record_name}-${activeVideo.record_id}`;
    }
    firebase.deleteFile(path).then(() => {
      firebase.deleteRecord(
        currentUserId,
        tabIndex === 0 ? activeAudio.record_id : activeVideo.record_id
      );
    });
  };

  return (
    <Container>
      <LeftWrapper>
        <Tabs
          isFitted
          orientation="vertical"
          variant="soft-rounded"
          colorScheme="brand"
          size="lg"
          onChange={index => setTabIndex(index)}
        >
          <TabList>
            <Tab>
              <FaMicrophone />
            </Tab>
            <Tab>
              <FaFilm />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RecordsList>
                {audioRecords.length !== 0 ? (
                  audioRecords.map(record => {
                    return (
                      <Record
                        key={uuid()}
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
                        key={uuid()}
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
            <Icon w="200px" h="200px" color="#A0AEC0" as={RiFileUnknowLine} />
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
                colorScheme="teal"
                onClick={handleDelete}
              >
                刪除
              </Button>
            </SelectionWrapper>
            <Divider mb="20px" />
            {tabIndex === 0 ? (
              <audio
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
              bg="#306172"
              aria-label="Save Recording"
              fontSize="20px"
              _hover={{ filter: 'brightness(150%)', color: 'black' }}
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
      <ChatCorner />
    </Container>
  );
};

export default ProfileRecords;
