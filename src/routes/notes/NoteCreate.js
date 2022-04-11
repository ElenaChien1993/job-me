import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import firebase from '../../utils/firebase';

const Container = styled.div`
  height: 750px;
  background: #ffffff;
  border-radius: 30px;
  margin-top: 20px;
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
  width: 55%;
  margin-left: auto;
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
  & input {
    width: 100%;
    border: solid 1px #cccccc;
    height: 40px;
    font-size: 20px;
    padding-left: 5px;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const RadioInput = styled.input`
  opacity: 0;
  position: fixed;
  width: 0;
`;

const TagButton = styled.label`
  width: 90px;
  height: 35px;
  background: ${(props) => (props.checked ? '#306172' : '#E3E3E3')};
  border-radius: 20px;
  color: ${(props) => (props.checked ? 'white' : '#707070')};
  font-size: 16px;
  line-height: 22px;
  margin-right: 15px;
  cursor: pointer;
  border: 1px solid #667080;
  text-align: center;
  padding-top: 5px;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const CheckBox = styled.input`
  height: 25px;
  width: 25px;
  background: #306172;
  color: white;
  margin-right: 15px;
  cursor: pointer;
`;

const CreateButton = styled.button`
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

const NoteCreate = () => {
  const [data, setData] = useState({});
  const [jobStatus, setJobStatus] = useState('未申請');
  const [checked, setChecked] = useState(true);
  const user = firebase.auth.currentUser;
  const navigate = useNavigate();
  const statusArray = [
    '未申請',
    '已申請',
    '未錄取',
    '已錄取',
    '無聲卡',
    '等待中',
  ];

  useEffect(() => {
    if (checked) {
      setData((prev) => {
        return { ...prev, is_share: true };
      });
    } else {
      setData((prev) => {
        return { ...prev, is_share: false };
      });
    }
  }, [checked]);

  const handleChange = (prop) => (event) => {
    event.preventDefault();
    setData((prev) => {
      return { ...prev, [prop]: event.target.value };
    });
  };

  const handleStatusSelect = (event) => {
    setJobStatus(event.target.value);
  };

  const handleCheckboxChange = (prop) => (event) => {
    setChecked(!checked);
  };

  const createNote = () => {
    const noteDataBrief = { ...data, status: jobStatus };
    firebase.setNoteBrief(user.uid, noteDataBrief).then((id) => {
      navigate(`/notes/details/${id}`);
    });
  };

  return (
    <Container>
      <LeftWrapper></LeftWrapper>
      <RightWrapper>
        <StyledForm>
          <InputWrap>
            <label>公司名稱</label>
            <input type="text" onChange={handleChange('company_name')} />
          </InputWrap>
          <InputWrap>
            <label>應徵職務</label>
            <input type="email" onChange={handleChange('job_title')} />
          </InputWrap>
          <InputWrap>
            <label>公司地點</label>
            <input type="text" onChange={handleChange('address')} />
          </InputWrap>
          <div>
            <p>目前對於此公司的求職狀態</p>
            <TagsWrapper>
              {statusArray.map((status, i) => {
                return (
                  <>
                    <RadioInput
                      type="radio"
                      id={`radio-${i}`}
                      name="status"
                      value={status}
                      key={i}
                      onChange={handleStatusSelect}
                      checked={jobStatus === status}
                    />
                    <TagButton
                      checked={jobStatus === status}
                      key={`label${i}`}
                      htmlFor={`radio-${i}`}
                    >
                      {status}
                    </TagButton>
                  </>
                );
              })}
            </TagsWrapper>
          </div>
          <CheckBoxWrapper>
            <CheckBox
              type="checkbox"
              checked={checked}
              onChange={handleCheckboxChange('is_share')}
            />
            <p>我願意和其他會員交流此公司的準備經驗</p>
          </CheckBoxWrapper>
        </StyledForm>
        <CreateButton onClick={createNote}>直接創建</CreateButton>
        <CreateButton onClick={createNote}>下一頁</CreateButton>
      </RightWrapper>
    </Container>
  );
};

export default NoteCreate;
