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

const Container = styled.div`
  display: flex;  
  flex-direction: column;
  align-items: center;
`

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledNoteBar = styled(NoteBar)`
  width: 40%;
`

const Question = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #306172;
  margin-bottom: 30px;
`;

const TimerSettingWrapper = styled.div``;

const PracticeStart = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const props = useOutletContext();

  useEffect(() => {
    setCurrentQuestion(props.practiceQuestions[0].question);
  }, []);

  console.log(currentQuestion);
  return (
    <Container>
      <TitleWrapper>
        <BackButton path="/practice" isStart/>
        <StyledNoteBar brief={props.brief} />
      </TitleWrapper>
      <Question>{currentQuestion}</Question>
      <h1>Player</h1>
      {/* <TimerSettingWrapper></TimerSettingWrapper> */}
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
