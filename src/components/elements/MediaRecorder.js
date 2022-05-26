import { useRef, useEffect } from 'react';

import { Badge } from '@chakra-ui/react';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import recordingJson from '../../images/recording.json';
import { device } from '../../style/variable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledVideo = styled.video`
  width: 90%;
  @media ${device.tablet} {
    width: 80%;
  }
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

  return <StyledVideo ref={videoRef} autoPlay controls />;
};

VideoPreview.propTypes = {
  stream: PropTypes.object,
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

Audio.propTypes = {
  status: PropTypes.string,
  mediaBlobUrl: PropTypes.string,
};

const Video = ({ status, mediaBlobUrl, previewStream }) => {
  return (
    <Container>
      <Badge fontSize="1.2em" variant="outline" colorScheme="orange" mb="20px">
        {STATUS[status]}
      </Badge>
      {status === 'stopped' && (
        <StyledVideo src={mediaBlobUrl} controls autoPlay loop />
      )}
      {(status === 'recording' || status === 'paused') && (
        <VideoPreview stream={previewStream} />
      )}
    </Container>
  );
};

Video.propTypes = {
  status: PropTypes.string,
  mediaBlobUrl: PropTypes.string,
  previewStream: PropTypes.object,
};

export { Audio, Video };
