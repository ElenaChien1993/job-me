import { useReactMediaRecorder } from 'react-media-recorder';
import { Button, IconButton, Icon, Tooltip, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  VscDebugRestart,
  VscDebugPause,
  VscDebugStart,
  VscStopCircle,
} from 'react-icons/vsc';
import { MdSaveAlt, MdNavigateNext, MdTimer } from 'react-icons/md';
import styled from 'styled-components';

import { Audio, Video } from './elements/MediaRecorder';
import CountDown from './elements/CountDown';
import firebase from '../utils/firebase';
import Loader from './Loader';
import { useState } from 'react';

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  justify-content: space-around;
  margin-top: 30px;
`;

const Reminder = styled.div`
  margin-top: 30px;
  color: red;
`;

const CountDownWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Recording = ({
  timer,
  brief,
  practiceQuestions,
  current,
  recordType,
  setCurrent,
  setProgress,
}) => {
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    video: recordType === '錄音' ? false : true,
    audio: true,
    echoCancellation: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { company_name, job_title } = brief;
  const user = firebase.auth.currentUser;
  const toast = useToast();

  const getDownloadURL = async (type, id) => {
    const fileBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const path = `${type === 0 ? 'audios' : 'videos'}/${
      user.uid
    }/${company_name}｜${job_title}/${
      practiceQuestions[current].question
    }-${id}`;

    const url = await firebase.uploadFile(path, fileBlob).then(() => {
      return firebase.getDownloadURL(path);
    });

    return url;
  };

  const handleSave = async type => {
    setIsLoading(true);
    const recordData = {
      date: firebase.Timestamp.fromDate(new Date()),
      type: type,
      record_name: practiceQuestions[current].question,
      record_job: `${company_name}｜${job_title}`,
    };
    firebase.setRecord(user.uid, recordData).then(async id => {
      try {
        const url = await getDownloadURL(type, id);
        firebase.updateRecord(user.uid, id, { link: url });
        setIsLoading(false);
        toast({
          title: '成功！',
          description: '已將檔案存在您的個人檔案中',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        console.log(error);
        toast({
          title: '哎呀',
          description: '上傳檔案時發生錯誤，請稍後再試',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    });
  };

  const goNext = () => {
    const numbers = practiceQuestions.length;
    if (current === numbers - 1) {
      setProgress('finished');
      return;
    }
    setCurrent(prev => prev + 1);
    clearBlobUrl();
    setProgress('before');
  };

  console.log(status);

  return (
    <>
      {isLoading && <Loader isLoading={isLoading} hasShadow />}
      {status === 'acquiring_media' && <Loader isLoading hasShadow />}
      {status === 'permission_denied' && <div>請允許瀏覽器使用鏡頭和麥克風</div>}
      {status !== 'stopped' && (
        <CountDownWrapper>
          <Icon as={MdTimer} boxSize="4rem" mr="10px" />
          <CountDown
            timer={timer}
            status={status}
            stopRecording={stopRecording}
          />
        </CountDownWrapper>
      )}
      {recordType === '錄音' ? (
        <Audio status={status} mediaBlobUrl={mediaBlobUrl} />
      ) : (
        <Video
          status={status}
          mediaBlobUrl={mediaBlobUrl}
          previewStream={previewStream}
        />
      )}
      {status === 'idle' ? (
        <Button
          colorScheme="brand"
          onClick={startRecording}
          rightIcon={<ArrowForwardIcon />}
          mt="20px"
        >
          開始答題
        </Button>
      ) : (
        <>
          <ButtonsWrapper>
            <Tooltip hasArrow label="重新開始" bg="gray.300" color="black">
              <IconButton
                isRound
                color="white"
                bg="#306172"
                aria-label="Restart Recording"
                fontSize="20px"
                _hover={{ filter: 'brightness(150%)', color: 'black' }}
                onClick={clearBlobUrl}
                icon={<VscDebugRestart />}
              />
            </Tooltip>
            {status === 'paused' && (
              <IconButton
                isRound
                color="white"
                bg="#306172"
                aria-label="Resume Recording"
                fontSize="20px"
                _hover={{ filter: 'brightness(150%)', color: 'black' }}
                onClick={resumeRecording}
                icon={<VscDebugStart />}
              />
            )}
            {status === 'recording' && (
              <IconButton
                isRound
                color="white"
                bg="#306172"
                aria-label="Pause Recording"
                fontSize="20px"
                _hover={{ filter: 'brightness(150%)', color: 'black' }}
                onClick={pauseRecording}
                icon={<VscDebugPause />}
              />
            )}
            {status !== 'stopped' && (
              <Tooltip
                hasArrow
                label="結束此次練習"
                bg="gray.300"
                color="black"
              >
                <IconButton
                  isRound
                  color="white"
                  bg="#306172"
                  aria-label="End Recording"
                  fontSize="20px"
                  _hover={{ filter: 'brightness(150%)', color: 'black' }}
                  onClick={stopRecording}
                  icon={<VscStopCircle />}
                />
              </Tooltip>
            )}
            {status === 'stopped' && (
              <>
                <Tooltip hasArrow label="儲存練習" bg="gray.300" color="black">
                  <IconButton
                    isRound
                    color="white"
                    bg="#306172"
                    aria-label="Save Recording"
                    fontSize="20px"
                    _hover={{ filter: 'brightness(150%)', color: 'black' }}
                    onClick={() => handleSave(recordType === '錄音' ? 0 : 1)}
                    icon={<MdSaveAlt />}
                  />
                </Tooltip>
                <Button
                  colorScheme="brand"
                  onClick={goNext}
                  rightIcon={<MdNavigateNext />}
                >
                  前往下一題
                </Button>
              </>
            )}
          </ButtonsWrapper>
          {status === 'stopped' && (
            <Reminder>若希望在帳號中留存此檔案，記得按儲存唷！</Reminder>
          )}
        </>
      )}
    </>
  );
};

export default Recording;
