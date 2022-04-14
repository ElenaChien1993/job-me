import { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Button, Input, IconButton } from '@chakra-ui/react';
import {
  ArrowForwardIcon,
  ChevronLeftIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import RadioGroup from '../../components/RadioGroup';
import Loader from '../../components/Loader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

const BackButton = styled(Button)`
  && {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const NoteWrapper = styled.div`
  display: flex;
  height: 80px;
  align-items: center;
  border-radius: 24px;
  background: white;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  justify-content: center;
  margin-top: 20px;
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: #306172;
  position: absolute;
  left: 0;
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: black;
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
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState(null);
  const [questionsBase, setQuestionsBase] = useState('隨機');
  const [recordType, setRecordType] = useState('錄影');
  const [newQuestion, setNewQuestion] = useState('');
  const { databaseNotes, practiceQuestions, setPracticeQuestions } =
    useOutletContext();

  let params = useParams();
  const noteId = params.noteId;

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
    const noteBrief = databaseNotes.filter((note) => note.note_id === noteId);
    setBrief(...noteBrief);
  }, [databaseNotes]);

  console.log(databaseNotes, brief, details);

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

  return (
    <Container>
      <Loader isLoading={isLoading} />
      {!isLoading && (
        <>
          <TopWrapper>
            <TitleWrapper>
              <Link to="/notes">
                <BackButton
                  size="sm"
                  leftIcon={<ChevronLeftIcon />}
                  variant="outline"
                  colorScheme="teal"
                >
                  回前頁
                </BackButton>
              </Link>
              <Title>面試練習設定</Title>
            </TitleWrapper>
            <NoteWrapper>
              <CompanyName>{brief.company_name || '安安'}</CompanyName>
              <JobTitle>{brief.job_title}</JobTitle>
            </NoteWrapper>
          </TopWrapper>
          <SettingWrapper>
            <OptionWrapper>
              <OptionTitle>練習題數</OptionTitle>
              <StyledInput
                size="sm"
                value="default"
                // onChange={handleChange('company_name')}
              />
            </OptionWrapper>
            <OptionWrapper>
              <OptionTitle>題庫選擇</OptionTitle>
              <RadioGroup items={['隨機', '指定']} setter={setQuestionsBase} />
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
              <RadioGroup items={['錄音', '錄影']} setter={setRecordType} />
            </OptionWrapper>
            <Reminder>*稍後記得允許麥克風和相機使用權限</Reminder>
          </SettingWrapper>
          <div>
            <Button
              size="sm"
              // onClick={() => setIsFilesEditing(true)}
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
