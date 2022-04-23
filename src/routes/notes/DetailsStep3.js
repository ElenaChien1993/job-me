import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { Input, Textarea } from '@chakra-ui/react';

import firebase from '../../utils/firebase';

const Container = styled.div`
  min-height: 750px;
  height: auto;
  background: #ffffff;
  border-radius: 30px;
  margin: 40px auto 0;
  width: 80%;
`;

const LeftWrapper = styled.div`
  position: absolute;
  width: 350px;
  height: 750px;
  left: 110px;
  top: 110px;
  background: #306172;
  border-radius: 30px 0px 0px 30px;
`;

const RightWrapper = styled.div`
  width: 65%;
  margin-left: 350px;
  padding: 40px 44px 30px;
`;

const StyledForm = styled.form`
  margin-top: 16px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  & label {
    line-height: 24px;
    font-weight: 500;
  }
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

const StyledAddButton = styled.button`
  height: 30px;
  color: #306172;
  font-size: 16px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const StyledText = styled(Textarea)`
  && {
    height: 140px;
  }
`;

const StyledButton = styled.button`
  width: 115px;
  height: 35px;
  background: #306172;
  border-radius: 24px;
  padding: 9px 24px;
  color: white;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 16px;
  cursor: pointer;
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

  const handleAddField = e => {
    e.preventDefault();
    setValues(prev => {
      return {
        ...prev,
        questions: [...prev.questions, { question: '', answer: '' }],
      };
    });
  };

  const createNote = () => {
    firebase
      .setNoteBrief(user.uid, { ...noteDataBrief, creator: user.uid })
      .then(id => {
        firebase.setNoteDetails(id, noteDetails).then(() => {
          navigate(`/notes/details/${id}`);
        });
      });
  };

  return (
    <Container>
      <LeftWrapper></LeftWrapper>
      <RightWrapper>
        <StyledForm>
          <InputWrap>
            <label>可能會被問的面試問題</label>
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
            <StyledAddButton onClick={handleAddField}>
              ＋新增欄位
            </StyledAddButton>
          </InputWrap>
          <InputWrap>
            <label>Responsibilities（工作內容）</label>
            <StyledText
              onChange={handleChange('others')}
              placeholder="一些要再做功課的注意事項等等"
              size="md"
              defaultValue={values.others}
            />
          </InputWrap>
        </StyledForm>
        <StyledButton onClick={prevStep}>上一頁</StyledButton>
        <StyledButton onClick={createNote}>創建筆記</StyledButton>
      </RightWrapper>
    </Container>
  );
};

export default DetailsStep3;
