import { useRef, useEffect } from 'react';
import { Badge } from '@chakra-ui/react';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import recordingJson from '../../images/recording.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const STATUS = {
  idle: '準備開始',
  paused: '暫停中',
  recording: '錄製中',
  stopped: '已結束',
};

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return <video ref={videoRef} width="90%" autoPlay controls />;
};

const Audio = ({ status, mediaBlobUrl }) => {
  return (
    <Container>
      <Badge fontSize="1.2em" variant="outline" colorScheme="orange" mb="20px">
        {STATUS[status]}
      </Badge>
      {(status === 'recording' || status === 'paused') && (
        <Lottie
          loop
          animationData={recordingJson}
          play={status === 'recording'}
          style={{ width: 400, height: 80 }}
        />
      )}
      {status === 'stopped' && (
        <audio src={mediaBlobUrl} controls autoPlay loop />
      )}
    </Container>
  );
};

const Video = ({ status, mediaBlobUrl, previewStream }) => {

  return (
    <Container>
      <Badge fontSize="1.2em" variant="outline" colorScheme="orange" mb="20px">
        {STATUS[status]}
      </Badge>
      {status === 'stopped' ? (
        <video src={mediaBlobUrl} controls autoPlay loop />
      ) : (
        <VideoPreview stream={previewStream} />
      )}
    </Container>
  );
};

export { Audio, Video };
