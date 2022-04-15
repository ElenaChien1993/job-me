import { useRef, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

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

const Audio = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      echoCancellation: true,
    });

  console.log(mediaBlobUrl);

  return (
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {status === 'stopped' && (
        <audio src={mediaBlobUrl} controls autoPlay loop />
      )}
    </div>
  );
};

const Video = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: true,
      audio: true,
      echoCancellation: true,
    });

  console.log(mediaBlobUrl);

  return (
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <VideoPreview stream={previewStream} />
      {status === 'stopped' && (
        <video src={mediaBlobUrl} controls autoPlay loop />
      )}
    </div>
  );
};

export { Audio, Video };
