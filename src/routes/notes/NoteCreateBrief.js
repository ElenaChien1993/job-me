import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@chakra-ui/react';

import styled from 'styled-components';

import firebase from '../../utils/firebase';

const Container = styled.div`
  width: 80%;
  height: 750px;
  background: #ffffff;
  border-radius: 30px;
  margin: 40px auto 0;
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
  background: ${props => (props.checked ? '#306172' : '#E3E3E3')};
  border-radius: 20px;
  color: ${props => (props.checked ? 'white' : '#707070')};
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

const SideNote = styled.span`
  color: #999999;
  margin-right: 5px;
  font-size: 15px;
`;

const NoteCreateBrief = ({
  nextStep,
  handleChange,
  values,
  setValues,
  noteDataBrief,
  noteDetails,
}) => {
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

  const handleCheckboxChange = () => {
    setValues(prev => {
      return { ...prev, is_share: !values.is_share };
    });
  };

  const createNote = () => {
    firebase
      .setNoteBrief(user.uid, { ...noteDataBrief, creator: user.uid, creator_name: user.displayName || '未提供名字' })
      .then(id => {
        firebase.setNoteDetails(id, noteDetails).then(() => {
          navigate(`/notes/details/${id}`);
        });
      });
  };

  const handleTagsChange = e => {
    const tagsArray = e.target.value.split(',', 5);
    setValues(prev => {
      return { ...prev, tags: tagsArray };
    });
  };

  return (
    <Container>
      <LeftWrapper></LeftWrapper>
      <RightWrapper>
        <StyledForm>
          <InputWrap>
            <label>公司名稱</label>
            <StyledInput
              size="sm"
              defaultValue={values.company_name}
              onChange={handleChange('company_name')}
            />
          </InputWrap>
          <InputWrap>
            <label>應徵職務</label>
            <StyledInput
              size="sm"
              defaultValue={values.job_title}
              onChange={handleChange('job_title')}
            />
          </InputWrap>
          <InputWrap>
            <label>公司地點</label>
            <StyledInput
              size="sm"
              defaultValue={values.address}
              onChange={handleChange('address')}
            />
          </InputWrap>
          <div>
            <p>目前對於此公司的求職狀態</p>
            <TagsWrapper>
              {statusArray.map((status, i) => {
                return (
                  <React.Fragment key={i}>
                    <RadioInput
                      type="radio"
                      id={`radio-${i}`}
                      name="status"
                      value={status}
                      key={i}
                      onChange={handleChange('status')}
                      checked={values.status === status}
                    />
                    <TagButton
                      checked={values.status === status}
                      key={`label${i}`}
                      htmlFor={`radio-${i}`}
                    >
                      {status}
                    </TagButton>
                  </React.Fragment>
                );
              })}
            </TagsWrapper>
          </div>
          <InputWrap>
            <label>
              標籤
              <SideNote>
                {' '}
                Ex: 新創 / React / 最想要.....等自訂標籤以利搜尋（上限為 5 個）
              </SideNote>
            </label>
            <StyledInput
              size="sm"
              defaultValue={values.tags.join(',')}
              placeholder="請以「,」隔開每個標籤"
              onChange={handleTagsChange}
            />
          </InputWrap>
          <CheckBoxWrapper>
            <CheckBox
              type="checkbox"
              checked={values.is_share}
              onChange={handleCheckboxChange}
            />
            <p>我願意和其他會員交流此公司的準備經驗</p>
          </CheckBoxWrapper>
        </StyledForm>
        <CreateButton onClick={createNote}>直接創建</CreateButton>
        <CreateButton onClick={nextStep}>下一頁</CreateButton>
      </RightWrapper>
    </Container>
  );
};

export default NoteCreateBrief;
