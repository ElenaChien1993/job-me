import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Divider,
} from '@chakra-ui/react';
import { FaMicrophone, FaFilm } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import ChatCorner from './ChatCorner';
import { useEffect } from 'react';
import firebase from '../utils/firebase';

const Container = styled.div`
  margin: 20px 10%;
  padding: 30px 0;
  display: flex;
  height: 100%;
`;

const LeftWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 5px solid #c4c4c4;
  align-items: center;
  padding-right: 20px;
  width: 42%;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  width: 55%;
  height: 100%;
`;

const RecordsList = styled.div`
  width: 100%;
  height: 500px;
  padding-top: 20px;
  background: #ffffff;
  border-radius: 20px;
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

const ProfileRecords = () => {
  const [audioRecords, setAudioRecords] = useState(null);
  const [videoRecords, setVideoRecords] = useState(null);
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

  return (
    <Container>
      <LeftWrapper>
        <Tabs
          w="100%"
          isFitted
          orientation="vertical"
          variant="solid-rounded"
          colorScheme="teal"
          size="lg"
          onChange={index => setTabIndex(index)}
        >
          <TabList mb="3em">
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
                {audioRecords &&
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
                  })}
              </RecordsList>
            </TabPanel>
            <TabPanel>
              <RecordsList>
                {videoRecords &&
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
                  })}
              </RecordsList>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </LeftWrapper>
      <RightWrapper>
        <SelectionWrapper>
          <SectionTitle>
            {tabIndex === 0 ? activeAudio?.record_name : activeVideo?.record_name}
          </SectionTitle>
          <Button variant="outline" colorScheme="teal">
            刪除
          </Button>
        </SelectionWrapper>
        <Divider />
        {tabIndex === 0 ? <audio src={activeAudio.link} controls/> : <video src={activeVideo.link} controls/> }
        <Reminder>檔案刪除後就無法再讀取，請記得先下載</Reminder>
      </RightWrapper>
      <ChatCorner />
    </Container>
  );
};

export default ProfileRecords;
