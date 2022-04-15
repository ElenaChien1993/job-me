/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Link,
  useOutletContext,
  useNavigate,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';

import BackButton from '../../components/elements/BackButton';
import NoteBar from '../../components/elements/NoteBar';
import BeforeRecord from '../../components/BeforeRecord';
import Recording from '../../components/Recording';
import { Audio, Video } from '../../components/elements/MediaRecorder';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledNoteBar = styled(NoteBar)`
  width: 40%;
`;

const Question = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #306172;
  margin-bottom: 30px;
`;

const PlayerWrapper = styled.div`
  margin-bottom: 20px;
`;

const TimerSettingWrapper = styled.div`
  display: flex;
  width: 40%;
  margin-bottom: 20px;
  justify-content: center;s
`;

const PracticeStart = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [timer, setTimer] = useState(3);
  const [progress, setProgress] = useState('before');
  const props = useOutletContext();

  useEffect(() => {
    setCurrentQuestion(props.practiceQuestions[0].question);
  }, []);

  console.log(props.practiceQuestions, currentQuestion);
  return (
    <Container>
      <TitleWrapper>
        <BackButton path="/practice" isStart />
        <StyledNoteBar brief={props.brief} />
      </TitleWrapper>
      <Question>{currentQuestion}</Question>
      {progress === 'before' && <BeforeRecord
        recordType={props.recordType}
        timer={timer}
        setTimer={setTimer}
        setProgress={setProgress}
      />}
      {progress === 'recording' && <Recording
        timer={timer}
        setProgress={setProgress}
      />}

    </Container>
  );
};

export default PracticeStart;
