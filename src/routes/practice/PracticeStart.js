/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import {
  Link,
  useOutletContext,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Icon, Button } from '@chakra-ui/react';
import { BiWinkSmile } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import styled from 'styled-components';

import BackButton from '../../components/elements/BackButton';
import NoteBar from '../../components/elements/NoteBar';
import BeforeRecord from '../../components/BeforeRecord';
import Recording from '../../components/Recording';

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

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #306172;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  && {
    height: 40px;
    width: 200px;
    color: white;
    background: #306172;
    &:hover {
      filter: brightness(110%);
      color: black;
    }
  }
`;

const PracticeStart = () => {
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(3);
  const [progress, setProgress] = useState('before');
  const props = useOutletContext();

  console.log(props.practiceQuestions);

  return (
    <Container>
      <TitleWrapper>
        <BackButton path="/practice" isStart />
        <StyledNoteBar brief={props.brief} />
      </TitleWrapper>
      {progress !== 'finished' && (
        <Question>{props.practiceQuestions[current].question}</Question>
      )}
      {progress === 'before' && (
        <BeforeRecord
          recordType={props.recordType}
          timer={timer}
          setTimer={setTimer}
          setProgress={setProgress}
        />
      )}
      {progress === 'recording' && (
        <Recording
          timer={timer}
          brief={props.brief}
          recordType={props.recordType}
          setCurrent={setCurrent}
          practiceQuestions={props.practiceQuestions}
          current={current}
          setProgress={setProgress}
        />
      )}
      {progress === 'finished' && (
        <>
          <Icon boxSize={200} as={BiWinkSmile} />
          <Title>此次練習已結束！你好棒！</Title>
          <Title>再多練習其他公司的面試吧～</Title>
          <StyledButton variant="solid" size="xl" rightIcon={<CgProfile />}>
            前往查看練習檔案
          </StyledButton>
        </>
      )}
    </Container>
  );
};

export default PracticeStart;
