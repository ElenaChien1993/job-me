import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useReactMediaRecorder } from 'react-media-recorder';
import { Button, IconButton, Icon, Tooltip, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  VscDebugRestart,
  VscDebugPause,
  VscDebugStart,
  VscStopCircle,
} from 'react-icons/vsc';
import { MdOutlineSave, MdNavigateNext, MdTimer } from 'react-icons/md';
import styled from 'styled-components';

import { Audio, Video } from '../elements/MediaRecorder';
import CountDown from '../elements/CountDown';
import firebase from '../../utils/firebase';
import Loader from '../Loader';
import { device, color } from '../../style/variable';

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 30px 0;
  @media ${device.mobileM} {
    width: 100%;
  }
  @media ${device.tablet} {
    width: 50%;
  }
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
    error,
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
  const { currentUserId } = useOutletContext();
  const toast = useToast();

  useEffect(() => {
    if (error === 'permission_denied') {
      toast({
        title: '哎呀',
        description: '請允許瀏覽器使用您的麥克風 & 鏡頭',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [error, toast]);

  const getDownloadURL = async (type, id) => {
    const fileBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const path = `${
      type === 0 ? 'audios' : 'videos'
    }/${currentUserId}/${company_name}｜${job_title}/${
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
    firebase
      .createDoc(`users/${currentUserId}/records`, recordData, 'record_id')
      .then(async id => {
        try {
          const url = await getDownloadURL(type, id);
          firebase.updateRecord(currentUserId, id, { link: url });
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

  return (
    <>
      {isLoading && <Loader isLoading={isLoading} hasShadow />}
      {status === 'acquiring_media' && <Loader isLoading hasShadow />}
      {status !== 'stopped' && (
        <CountDownWrapper>
          <Icon as={MdTimer} boxSize="3rem" mr="10px" />
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
                bg={color.primary}
                aria-label="Restart Recording"
                fontSize="20px"
                _hover={{
                  background: 'none',
                  color: 'black',
                  border: `2px solid ${color.primary}`,
                }}
                onClick={clearBlobUrl}
                icon={<VscDebugRestart />}
              />
            </Tooltip>
            {status === 'paused' && (
              <IconButton
                isRound
                color="white"
                bg={color.primary}
                aria-label="Resume Recording"
                fontSize="20px"
                _hover={{
                  background: 'none',
                  color: 'black',
                  border: `2px solid ${color.primary}`,
                }}
                onClick={resumeRecording}
                icon={<VscDebugStart />}
              />
            )}
            {status === 'recording' && (
              <IconButton
                isRound
                color="white"
                bg={color.primary}
                aria-label="Pause Recording"
                fontSize="20px"
                _hover={{
                  background: 'none',
                  color: 'black',
                  border: `2px solid ${color.primary}`,
                }}
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
                  bg={color.primary}
                  aria-label="End Recording"
                  fontSize="20px"
                  _hover={{
                    background: 'none',
                    color: 'black',
                    border: `2px solid ${color.primary}`,
                  }}
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
                    bg={color.primary}
                    aria-label="Save Recording"
                    fontSize="20px"
                    _hover={{
                      background: 'none',
                      color: 'black',
                      border: `2px solid ${color.primary}`,
                    }}
                    onClick={() => handleSave(recordType === '錄音' ? 0 : 1)}
                    icon={<MdOutlineSave />}
                  />
                </Tooltip>
                <Button
                  colorScheme="brand"
                  onClick={goNext}
                  rightIcon={<MdNavigateNext />}
                >
                  {current === practiceQuestions.length - 1
                    ? '結束練習'
                    : '前往下一題'}
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
