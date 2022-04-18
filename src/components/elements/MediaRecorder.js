import { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Status = styled.div`
  margin: 10px 0;
  font-size: 20px;
  font-weight: 500;
`;

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

  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

const Audio = ({ status, mediaBlobUrl }) => {
  console.log(mediaBlobUrl);

  return (
    <Container>
      <Status>{status}</Status>
      {status === 'stopped' && (
        <audio src={mediaBlobUrl} controls autoPlay loop />
      )}
    </Container>
  );
};

const Video = ({ status, mediaBlobUrl, previewStream}) => {

  console.log(mediaBlobUrl);

  return (
    <Container>
      <Status>{status}</Status>
      {status === 'stopped' ? (
        <video src={mediaBlobUrl} controls autoPlay loop />
      ) : <VideoPreview stream={previewStream} />}
    </Container>
  );
};

export { Audio, Video };
