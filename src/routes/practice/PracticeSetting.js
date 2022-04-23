import { useState, useEffect } from 'react';
import {
  useParams,
  useOutletContext,
  useNavigate,
} from 'react-router-dom';
import { Button, Input, IconButton } from '@chakra-ui/react';
import {
  ArrowForwardIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import RadioGroup from '../../components/elements/RadioGroup';
import Loader from '../../components/Loader';
import NoteBar from '../../components/elements/NoteBar';
import BackButton from '../../components/elements/BackButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 10% 0;
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
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #306172;
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 80%;
  justify-content: center;
  border-radius: 15px;
  background: white;
  padding: 40px 80px;
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    border-color: ${(props) => (props.isValid ? 'black' : 'red')};
  }
`;

const OptionTitle = styled.div`
  width: 35%;
  font-size: 24px;
  font-weight: 700;
  color: #306172;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const CheckBox = styled.input`
  height: 16px;
  width: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const Questions = styled.div`
  margin-left: auto;
`;

const Reminder = styled.div`
  margin-left: auto;
  margin-top: 20px;
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
  const [qty, setQty] = useState(5);
  const [isQtyValid, setIsQtyValid] = useState(true);
  const props = useOutletContext();

  let params = useParams();
  const noteId = params.noteId;
  const navigate = useNavigate();

  useEffect(() => {
    firebase.getNoteDetails(noteId).then((snap) => {
      const newArray = snap.data().questions.map((q) => {
        return { ...q, checked: true };
      });
      setDetails({ ...snap.data(), questions: newArray });
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const noteBrief = props.databaseNotes.filter(
      (note) => note.note_id === noteId
    );
    props.setBrief(...noteBrief);
  }, [props.databaseNotes]);

  // console.log(databaseNotes, brief, details);

  const handleInputChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleAddQuestion = () => {
    const update = [
      ...details.questions,
      { question: newQuestion, answer: '' },
    ];
    setDetails((prev) => {
      return { ...prev, questions: update };
    });
    setNewQuestion('');
  };

  const handleCheckboxChange = (i) => {
    const updatedChecked = details.questions.map((item, index) =>
      index === i ? { ...item, checked: !item.checked } : item
    );

    setDetails((prev) => {
      return { ...prev, questions: updatedChecked };
    });
  };

  const qtyValidate = (value) => {
    if (value < 1) {
      setIsQtyValid(false);
      return;
    }
    setIsQtyValid(true);
  };

  useEffect(() => {
    qtyValidate(qty);
  }, [qty]);

  const shuffleQuestions = () => {
    const filtered = details.questions.filter((q) => q.checked === true);
    const shuffled = filtered.sort(() => {
      return 0.5 - Math.random();
    });
    const selected = shuffled.slice(0, qty);
    props.setPracticeQuestions(selected);
  };

  const handleStartPractice = () => {
    shuffleQuestions();
    navigate(`/practice/start/${noteId}`);
  };

  return (
    <Container>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <>
          <TopWrapper>
            <TitleWrapper>
              <BackButton path="/practice" isStart={false}/>
              <Title>面試練習設定</Title>
            </TitleWrapper>
            <NoteBar brief={props.brief} />
          </TopWrapper>
          <SettingWrapper>
            <OptionWrapper>
              <OptionTitle>練習題數</OptionTitle>
              <StyledInput
                isValid={isQtyValid}
                type="number"
                size="sm"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              {!isQtyValid && <Reminder>請正確輸入數字</Reminder>}
            </OptionWrapper>
            <OptionWrapper>
              <OptionTitle>題庫選擇</OptionTitle>
              <RadioGroup items={['隨機', '指定']} value={questionsBase} setter={setQuestionsBase} />
            </OptionWrapper>
            {questionsBase === '指定' && (
              <Questions>
                {details.questions.map((item, i) => {
                  return (
                    <CheckBoxWrapper key={uuid()}>
                      <CheckBox
                        type="checkbox"
                        checked={details.questions[i].checked}
                        onChange={() => handleCheckboxChange(i)}
                      />
                      <div>{item.question}</div>
                    </CheckBoxWrapper>
                  );
                })}
                <InputWrapper>
                  <IconButton
                    aria-label="Add question"
                    onClick={handleAddQuestion}
                    icon={<PlusSquareIcon />}
                  />
                  <Input
                    variant="flushed"
                    value={newQuestion}
                    onChange={handleInputChange}
                    placeholder="請自行輸入題目"
                  />
                </InputWrapper>
              </Questions>
            )}
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
          <div>
            <Button
              size="sm"
              onClick={handleStartPractice}
              rightIcon={<ArrowForwardIcon />}
            >
              開始練習
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default PracticeSetting;
