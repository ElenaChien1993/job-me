import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import BackButton from '../../components/elements/BackButton';
import NoteBar from '../../components/elements/NoteBar';
import BeforeRecord from '../../components/practice/BeforeRecord';
import Recording from '../../components/practice/Recording';
import finishJson from '../../images/finish.json';
import { device, color } from '../../style/variable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto 5%;
  width: 90%;
  max-width: 1296px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const StyledNoteBar = styled(NoteBar)`
  padding: 0 30px;
`;

const Question = styled.div`
  font-weight: 700;
  color: ${color.primary};
  margin-bottom: 10px;
  text-align: center;
  font-size: 28px;
  @media ${device.tablet} {
    font-size: 34px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  color: ${color.primary};
  margin-bottom: 20px;
  font-size: 24px;
  @media ${device.tablet} {
    font-size: 30px;
  }
`;

const StyledButton = styled(Button)`
  && {
    height: 40px;
    width: 200px;
    color: white;
    background: ${color.primary};
    &:hover {
      filter: brightness(110%);
      color: black;
    }
  }
`;

const PracticeStart = () => {
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(180);
  const [progress, setProgress] = useState('before');
  const props = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.practiceQuestions === [] || !props.brief) {
      navigate('/practice');
    }
  }, []);

  const goToProfile = () => {
    navigate(`/profile/${props.currentUserId}?tab=records`);
  };

  return (
    <Container>
      <TitleWrapper>
        <BackButton path="/practice" $isStart />
        <StyledNoteBar brief={props.brief} />
      </TitleWrapper>
      {progress !== 'finished' && (
        <Question>{props.practiceQuestions[current]?.question}</Question>
      )}
      {progress === 'before' && (
        <BeforeRecord
          setRecordType={props.setRecordType}
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
          <Lottie
            loop
            animationData={finishJson}
            play
            style={{ width: 400, height: 370 }}
          />
          <Title>????????????????????????????????????</Title>
          <Title>???????????????????????????????????????</Title>
          <StyledButton
            onClick={goToProfile}
            variant="solid"
            size="xl"
            rightIcon={<CgProfile />}
          >
            ????????????????????????
          </StyledButton>
        </>
      )}
    </Container>
  );
};

export default PracticeStart;
