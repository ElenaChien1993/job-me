import { useReactMediaRecorder } from 'react-media-recorder';
import { Button, IconButton } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  VscDebugRestart,
  VscDebugPause,
  VscDebugStart,
  VscStopCircle,
} from 'react-icons/vsc';
import { MdSaveAlt, MdNavigateNext } from 'react-icons/md';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { Audio, Video } from './elements/MediaRecorder';
import CountDown from './elements/CountDown';
import firebase from '../utils/firebase';

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  justify-content: space-around;
  margin-top: 30px;
`;

const Reminder = styled.div`
  margin-left: auto;
  margin-top: 20px;
  color: red;
`;

const Recording = ({
  timer,
  brief,
  practiceQuestions,
  current,
  recordType,
  setCurrent,
  setProgress
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
  const { company_name, job_title } = brief;
  const user = firebase.auth.currentUser;

  const getDownloadURL = async type => {
    const fileBlob = await fetch(mediaBlobUrl).then(r => r.blob());
    const path = `${type === 0 ? 'audios' : 'videos'}/${
      user.uid
    }/${company_name}｜${job_title}/${practiceQuestions[current].question}-${uuid()}`;

    const url = await firebase.uplaodFile(path, fileBlob).then(() => {
      return firebase.getDownloadURL(path);
    });

    return url;
  };

  const handleSave = async type => {
    const url = await getDownloadURL(type);

    const recordData = {
      date: firebase.Timestamp.fromDate(new Date()),
      type: type,
      link: url,
      record_name: practiceQuestions[current].question,
    };

    firebase.setRecord(user.uid, recordData).then(() => alert('已成功儲存！'));
  };

  const goNext = () => {
    const numbers = practiceQuestions.length;
    if (current === numbers - 1) {
      setProgress('finished');
      return;
    }
    setCurrent(prev => prev + 1);
    clearBlobUrl();
  };

  return (
    <>
      {status !== 'stopped' && (
        <CountDown
          timer={timer}
          status={status}
          stopRecording={stopRecording}
        />
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
          size="sm"
          onClick={startRecording}
          rightIcon={<ArrowForwardIcon />}
        >
          開始答題
        </Button>
      ) : (
        <>
          <ButtonsWrapper>
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
            )}
            {status === 'stopped' && (
              <>
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
                <Button
                  size="sm"
                  onClick={goNext}
                  rightIcon={<MdNavigateNext />}
                >
                  前往下一題
                </Button>
              </>
            )}
          </ButtonsWrapper>
          {status === 'stopped' && <Reminder>若希望在帳號中留存此檔案，記得按儲存唷！</Reminder>}
        </>
      )}
    </>
  );
};

export default Recording;
