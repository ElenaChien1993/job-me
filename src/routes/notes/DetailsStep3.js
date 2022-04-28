import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { Button, Input, useToast } from '@chakra-ui/react';

import firebase from '../../utils/firebase';
import AddField from '../../components/elements/AddField';

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 18px;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const FilesWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  & input {
    margin-right: 10px;
  }
  & label {
    width: 50px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailsStep3 = ({
  prevStep,
  handleChange,
  values,
  setValues,
  noteDataBrief,
  noteDetails,
}) => {
  const user = firebase.auth.currentUser;
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = i => e => {
    const updated = values.questions.map((q, index) =>
      index === i
        ? {
            ...q,
            question: e.target.value,
          }
        : q
    );

    setValues(prev => {
      return { ...prev, questions: updated };
    });
  };

  const createNote = () => {
    if (values.company_name === '' || values.job_title === '') {
      toast({
        title: '哎呀',
        description: '公司名稱和應徵職稱為必填欄位',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    firebase
      .setNoteBrief(user.uid, { ...noteDataBrief, creator: user.uid })
      .then(id => {
        firebase.setNoteDetails(id, noteDetails).then(() => {
          navigate(`/notes/details/${id}`);
        });
      });
  };

  return (
    <>
      <>
        <InputWrap>
          <InputLabel>可能會被問的面試問題</InputLabel>
          {values.questions.map((q, i) => {
            return (
              <FilesWrap key={i}>
                <label>問題</label>
                <StyledInput
                  type="text"
                  defaultValue={values.questions[i].question}
                  onChange={handleInputChange(i)}
                />
              </FilesWrap>
            );
          })}
          <AddField
            setter={setValues}
            objectKey="questions"
            newValue={{
              question: '',
              answer: '',
            }}
          />
        </InputWrap>
      </>
      <ButtonGroup>
        <Button
          size="lg"
          colorScheme="brand"
          borderRadius="full"
          onClick={prevStep}
        >
          上一頁
        </Button>
        <Button
          size="lg"
          colorScheme="brand"
          borderRadius="full"
          onClick={createNote}
        >
          創建筆記
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DetailsStep3;
