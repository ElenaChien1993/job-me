import styled from 'styled-components';
import { Input } from '@chakra-ui/react';

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

const RequirementWrapper = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  width: 100%;
`;

const CheckBox = styled.input`
  height: 25px;
  width: 25px;
  margin-right: 15px;
  cursor: pointer;
`;

const StyledAddButton = styled.button`
  height: 30px;
  color: #306172;
  font-size: 16px;
  margin-bottom: 16px;
  cursor: pointer;
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

const SideNote = styled.span`
  color: #999999;
  margin-right: 5px;
  font-size: 15px;
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

const FileName = styled.div`
  display: flex;
  align-items: center;
  width: 40%;
`;

const FileLink = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
`;

const DetailsStep2 = ({
  nextStep,
  prevStep,
  handleChange,
  values,
  setValues,
}) => {
  const handleCheckboxChange = (item, itemIndex) => {
    const updatedChecked = values.bonus.map((item, index) =>
      index === itemIndex
        ? {
            ...item,
            is_qualified: !item.is_qualified,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, bonus: updatedChecked };
    });
  };

  const handleAddField = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        bonus: [...prev.bonus, { is_qualified: false, description: '' }],
      };
    });
  };

  const handleInputChange = (i) => (e) => {
    const updatedDes = values.bonus.map((item, index) =>
      index === i
        ? {
            ...item,
            description: e.target.value,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, bonus: updatedDes };
    });
  };

  const handleFileNameInputChange = (i) => (e) => {
    const updated = values.attached_files.map((item, index) =>
      index === i
        ? {
            ...item,
            file_name: e.target.value,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, attached_files: updated };
    });
  };

  const handleFileLinkInputChange = (i) => (e) => {
    const updated = values.attached_files.map((item, index) =>
      index === i
        ? {
            ...item,
            file_link: e.target.value,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, attached_files: updated };
    });
  };

  const handleFileAddField = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        attached_files: [
          ...prev.attached_files,
          { file_name: '', file_link: '' },
        ],
      };
    });
  };

  return (
    <RightWrapper>
      <StyledForm>
        <InputWrap>
          <label>Bonus（加分項目）</label>
          {values.bonus.map((req, i) => {
            return (
              <RequirementWrapper key={i}>
                <CheckBox
                  type="checkbox"
                  checked={values.bonus[i].is_qualified}
                  onChange={() => handleCheckboxChange(req, i)}
                />
                <StyledInput
                  type="text"
                  defaultValue={values.bonus[i].description}
                  onChange={handleInputChange(i)}
                />
              </RequirementWrapper>
            );
          })}
          <StyledAddButton onClick={handleAddField}>＋新增欄位</StyledAddButton>
        </InputWrap>
        <InputWrap>
          <label>職缺連結</label>
          <StyledInput
            type="text"
            defaultValue={values.job_link}
            onChange={handleChange('job_link')}
          />
        </InputWrap>
        <InputWrap>
          <label>我的履歷連結</label>
          <StyledInput
            type="text"
            defaultValue={values.resume_link}
            onChange={handleChange('resume_link')}
          />
        </InputWrap>
        <InputWrap>
          <label>
            我的其他檔案連結
            <SideNote>
              {' '}
              Ex: 個人網站 / 作品集 / CV / github 頁面.....等
            </SideNote>
          </label>
          {values.attached_files.map((file, i) => {
            return (
              <FilesWrap key={i}>
                <FileName>
                  <label>檔名</label>
                  <StyledInput
                    type="text"
                    defaultValue={values.attached_files[i].file_name}
                    onChange={handleFileNameInputChange(i)}
                  />
                </FileName>
                <FileLink>
                  <label>連結</label>
                  <StyledInput
                    type="text"
                    defaultValue={values.attached_files[i].file_link}
                    onChange={handleFileLinkInputChange(i)}
                  />
                </FileLink>
              </FilesWrap>
            );
          })}
          <StyledAddButton onClick={handleFileAddField}>
            ＋新增欄位
          </StyledAddButton>
        </InputWrap>
      </StyledForm>
      <StyledButton onClick={prevStep}>上一頁</StyledButton>
      <StyledButton onClick={nextStep}>下一頁</StyledButton>
    </RightWrapper>
  );
};

export default DetailsStep2;
