import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { FaMicrophone, FaFilm } from 'react-icons/fa';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import RecordAccordion from '../elements/RecordAccordion';

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: none;
  padding-right: 0;
  width: 100%;
`;

const Text = styled.div`
  margin: 0 20px;
  font-size: 20px;
  text-align: center;
`;

const ProfileMobileRecords = ({ onOpen }) => {
  const [audioRecords, setAudioRecords] = useState([]);
  const [videoRecords, setVideoRecords] = useState([]);
  const [activeRecord, setActiveRecord] = useState(null);
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
    if (tabIndex === 0) {
      setActiveRecord(audioRecords[0]);
    } else {
      setActiveRecord(videoRecords[0]);
    }
  }, [tabIndex, audioRecords, videoRecords]);

  return (
    <>
      <LeftWrapper>
        <Tabs
          w="100%"
          isFitted
          orientation="horizontal"
          variant="line"
          colorScheme="brand"
          size="lg"
          onChange={index => setTabIndex(index)}
        >
          <TabList>
            <Tab px="5px">
              <FaMicrophone />
            </Tab>
            <Tab px="5px">
              <FaFilm />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              {audioRecords.length !== 0 ? (
                <RecordAccordion
                  records={audioRecords}
                  tabIndex={tabIndex}
                  activeRecord={activeRecord}
                  setActiveRecord={setActiveRecord}
                  onOpen={onOpen}
                />
              ) : (
                <Text>尚無錄音練習紀錄</Text>
              )}
            </TabPanel>
            <TabPanel px={0}>
              {videoRecords.length !== 0 ? (
                <RecordAccordion
                  records={videoRecords}
                  tabIndex={tabIndex}
                  activeRecord={activeRecord}
                  setActiveRecord={setActiveRecord}
                  onOpen={onOpen}
                />
              ) : (
                <Text>尚無錄影練習紀錄</Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </LeftWrapper>
    </>
  );
};

export default ProfileMobileRecords;
