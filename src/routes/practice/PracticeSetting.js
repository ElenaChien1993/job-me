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
  width: 90%;
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
  flex-direction: column;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const Title = styled.div`
  font-weight: 700;
  color: ${color.secondary};
  font-size: 30px;
  @media ${device.tablet} {
    font-size: 42px;
  }
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  background: ${color.white};
  width: min-content;
  padding: 20px 20px;
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
  min-width: 310px;
  @media ${device.tablet} {
    min-width: 410px;
  }
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    border-color: ${props => (props.$isValid ? 'black' : 'red')};
  }
`;

const OptionTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${color.primary};
  min-width: 120px;
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
  background-color: ${color.primary}; ;
`;

const Questions = styled.div`
  margin-top: 20px;
  max-width: 70%;
  margin-left: 120px;
  @media ${device.tablet} {
    margin-left: 140px;
  }
`;

const Reminder = styled.div`
  margin-top: 20px;
  color: red;
  margin-left: 120px;
  @media ${device.tablet} {
    margin-left: 140px;
  }
`;

const QtyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.div`
  color: red;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
`;

const SideNote = styled.div`
  color: #999;
  margin-top: 10px;
  margin-left: 120px;
  @media ${device.tablet} {
    margin-left: 140px;
  }
`;

const PracticeSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [questionsBase, setQuestionsBase] = useState('隨機');
  const [newQuestion, setNewQuestion] = useState('');
  const [qty, setQty] = useState(3);
  const [isQtyValid, setIsQtyValid] = useState(true);
  const [isInputInvalid, setIsInputInvalid] = useState(false);
  const {
    databaseNotes,
    setBrief,
    setPracticeQuestions,
    brief,
    recordType,
    setRecordType,
  } = useOutletContext();

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
    const noteBrief = databaseNotes.filter(note => note.note_id === noteId);
    setBrief(...noteBrief);
  }, [databaseNotes, noteId, setBrief]);

  const handleInputChange = e => {
    setIsInputInvalid(false);
    setNewQuestion(e.target.value);
  };

  const handleAddQuestion = () => {
    if (newQuestion === '') {
      setIsInputInvalid(true);
      return;
    }
    const update = [
      ...details.questions,
      { question: newQuestion, answer: '', checked: true },
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
    setPracticeQuestions(selected);
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
            <NoteBar brief={brief} />
          </TopWrapper>
          <SettingWrapper>
            <OptionWrapper>
              <OptionTitle>練習題數</OptionTitle>
              <QtyWrapper>
                <StyledInput
                  $isValid={isQtyValid}
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
            {details.questions.length === 0 && questionsBase === '隨機' && (
              <SideNote>
                筆記中無面試猜題紀錄，請選擇「指定」新增此次練習題目
              </SideNote>
            )}
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
                <InputContainer>
                  <InputWrapper>
                    <Input
                      isInvalid={isInputInvalid}
                      errorBorderColor="crimson"
                      variant="flushed"
                      value={newQuestion}
                      onChange={handleInputChange}
                      placeholder="請自行輸入題目"
                    />
                    <IconButton
                      aria-label="Add question"
                      onClick={handleAddQuestion}
                      icon={<PlusSquareIcon />}
                      mr="10px"
                    />
                  </InputWrapper>
                  {isInputInvalid && <ErrorText>無法新增空白內容</ErrorText>}
                </InputContainer>
              )}
            </Questions>
            <OptionWrapper>
              <OptionTitle>紀錄模式</OptionTitle>
              <RadioGroup
                items={['錄音', '錄影']}
                value={recordType}
                setter={setRecordType}
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
