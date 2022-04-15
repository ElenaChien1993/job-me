/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Link,
  useOutletContext,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import BackButton from '../../components/elements/BackButton';
import NoteBar from '../../components/elements/NoteBar';
import SwitchElement from '../../components/elements/Switch';

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
  const [isTimer, setIsTimer] = useState(true);
  const [timer, setTimer] = useState(3);
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
      <PlayerWrapper>
        {props.recordType === '錄音' ? '錄音 Player' : '錄影 Player'}
      </PlayerWrapper>
      <TimerSettingWrapper>
        <SwitchElement isTimer={isTimer} setIsTimer={setIsTimer} />
        {isTimer ? (
          <>
            <p>此題定時</p>
            <div>
              <input value={timer} onChange={(e) => setTimer(e.target.value)} />
              <p>分鐘</p>
            </div>
          </>
        ) : (
          <p>此題不定時（回答時間上限為 3 分鐘）</p>
        )}
      </TimerSettingWrapper>
      <Button
        size="sm"
        // onClick={() => }
        rightIcon={<ArrowForwardIcon />}
      >
        開始練習
      </Button>
    </Container>
  );
};

export default PracticeStart;
