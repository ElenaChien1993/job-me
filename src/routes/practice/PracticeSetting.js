import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { Button, Input, IconButton, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon, PlusSquareIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import RadioGroup from '../../components/elements/RadioGroup';
import Loader from '../../components/Loader';
import NoteBar from '../../components/elements/NoteBar';
import BackButton from '../../components/elements/BackButton';
import { device, color } from '../../style/variable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto 0;
  max-width: 1000px;
  @media ${device.mobileM} {
    width: 90%;
  }
  @media ${device.laptop} {
    width: 80%;
  }
`;

const TopWrapper = styled.div`
  width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 10px;
  @media ${device.mobileM} {
    flex-direction: column;
  }
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #306172;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  background: ${color.white};
  @media ${device.mobileM} {
    padding: 20px 20px;
  }
  @media ${device.tablet} {
    padding: 20px 40px;
  }
  @media ${device.laptop} {
    padding: 20px 80px;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    border-color: ${props => (props.isValid ? 'black' : 'red')};
  }
`;

const OptionTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #306172;
  @media ${device.mobileM} {
    min-width: 120px;
  }
  @media ${device.tablet} {
    min-width: 140px;
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: center;
`;

const CheckBox = styled.input`
  min-height: 16px;
  min-width: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const Dot = styled.div`
  margin-right: 10px;
  min-width: 10px;
  min-height: 10px;
  border-radius: 5px;
  background-color: #306172;
`;

const Questions = styled.div`
  margin-left: 140px;
  margin-top: 20px;
  max-width: 70%;
`;

const Reminder = styled.div`
  margin-left: 140px;
  margin-top: 20px;
  color: red;
`;

const QtyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.div`
  color: red;
`;

const InputWrapper = styled.div`
  display: flex;
`;

const PracticeSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [questionsBase, setQuestionsBase] = useState('隨機');
  const [newQuestion, setNewQuestion] = useState('');
  const [qty, setQty] = useState(3);
  const [isQtyValid, setIsQtyValid] = useState(true);
  const props = useOutletContext();

  let params = useParams();
  const noteId = params.noteId;
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    firebase.getNoteDetails(noteId).then(snap => {
      const newArray = snap.data().questions.map(q => {
        return { ...q, checked: true };
      });
      setDetails({ ...snap.data(), questions: newArray });
      setIsLoading(false);
    });
  }, [noteId]);

  useEffect(() => {
    const noteBrief = props.databaseNotes.filter(
      note => note.note_id === noteId
    );
    props.setBrief(...noteBrief);
  }, [props.databaseNotes, noteId]);

  // console.log(databaseNotes, brief, details);

  const handleInputChange = e => {
    setNewQuestion(e.target.value);
  };

  const handleAddQuestion = () => {
    const update = [
      ...details.questions,
      { question: newQuestion, answer: '' },
    ];
    setDetails(prev => {
      return { ...prev, questions: update };
    });
    setNewQuestion('');
  };

  const handleCheckboxChange = i => {
    const updatedChecked = details.questions.map((item, index) =>
      index === i ? { ...item, checked: !item.checked } : item
    );

    setDetails(prev => {
      return { ...prev, questions: updatedChecked };
    });
  };

  const qtyValidate = value => {
    if (value < 1) {
      setIsQtyValid(false);
      return;
    }
    setIsQtyValid(true);
  };

  useEffect(() => {
    qtyValidate(qty);
  }, [qty]);

  const shuffleQuestions = filtered => {
    const shuffled = filtered.sort(() => {
      return 0.5 - Math.random();
    });
    const selected = shuffled.slice(0, qty);
    props.setPracticeQuestions(selected);
  };

  const handleStartPractice = () => {
    const filtered = details.questions.filter(q => q.checked === true);
    if (filtered.length < qty) {
      toast({
        title: '哎呀',
        description: '您的題庫數量少於練習題數，請更正選擇',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    shuffleQuestions(filtered);
    navigate(`/practice/start/${noteId}`);
  };

  return (
    <Container>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <>
          <TopWrapper>
            <TitleWrapper>
              <BackButton path="/practice" isStart={false} />
              <Title>面試練習設定</Title>
            </TitleWrapper>
            <NoteBar brief={props.brief} />
          </TopWrapper>
          <SettingWrapper>
            <OptionWrapper>
              <OptionTitle>練習題數</OptionTitle>
              <QtyWrapper>
                <StyledInput
                  isValid={isQtyValid}
                  type="number"
                  size="sm"
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                />
                {!isQtyValid && <ErrorText>請正確輸入數字</ErrorText>}
              </QtyWrapper>
            </OptionWrapper>
            <OptionWrapper>
              <OptionTitle>題庫選擇</OptionTitle>
              <RadioGroup
                items={['隨機', '指定']}
                value={questionsBase}
                setter={setQuestionsBase}
              />
            </OptionWrapper>
            <Questions>
              {details.questions.map((item, i) => {
                return (
                  <CheckBoxWrapper key={item.question}>
                    {questionsBase === '指定' ? (
                      <CheckBox
                        type="checkbox"
                        checked={details.questions[i].checked}
                        onChange={() => handleCheckboxChange(i)}
                      />
                    ) : (
                      <Dot />
                    )}
                    <div>{item.question}</div>
                  </CheckBoxWrapper>
                );
              })}
              {questionsBase === '指定' && (
                <InputWrapper>
                  <IconButton
                    aria-label="Add question"
                    onClick={handleAddQuestion}
                    icon={<PlusSquareIcon />}
                    mr="10px"
                  />
                  <Input
                    variant="flushed"
                    value={newQuestion}
                    onChange={handleInputChange}
                    placeholder="請自行輸入題目"
                  />
                </InputWrapper>
              )}
            </Questions>
            <OptionWrapper>
              <OptionTitle>紀錄模式</OptionTitle>
              <RadioGroup
                items={['錄音', '錄影']}
                value={props.recordType}
                setter={props.setRecordType}
              />
            </OptionWrapper>
            <Reminder>*稍後記得允許麥克風和相機使用權限</Reminder>
          </SettingWrapper>
          <Button
            colorScheme="brand"
            onClick={handleStartPractice}
            rightIcon={<ArrowForwardIcon />}
            my="30px"
          >
            開始練習
          </Button>
        </>
      )}
    </Container>
  );
};

export default PracticeSetting;
