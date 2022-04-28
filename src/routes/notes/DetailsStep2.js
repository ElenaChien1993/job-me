import styled from 'styled-components';
import { Button, Input } from '@chakra-ui/react';
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

const SideNote = styled.span`
  color: #999999;
  margin-left: 5px;
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

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

    setValues(prev => {
      return { ...prev, bonus: updatedChecked };
    });
  };

  const handleInputChange = i => e => {
    const updatedDes = values.bonus.map((item, index) =>
      index === i
        ? {
            ...item,
            description: e.target.value,
          }
        : item
    );

    setValues(prev => {
      return { ...prev, bonus: updatedDes };
    });
  };

  const handleFileNameInputChange = i => e => {
    const updated = values.attached_files.map((item, index) =>
      index === i
        ? {
            ...item,
            file_name: e.target.value,
          }
        : item
    );

    setValues(prev => {
      return { ...prev, attached_files: updated };
    });
  };

  const handleFileLinkInputChange = i => e => {
    const updated = values.attached_files.map((item, index) =>
      index === i
        ? {
            ...item,
            file_link: e.target.value,
          }
        : item
    );

    setValues(prev => {
      return { ...prev, attached_files: updated };
    });
  };

  return (
    <>
      <>
        <InputWrap>
          <InputLabel>Bonus（加分項目）</InputLabel>
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
          <AddField
            setter={setValues}
            objectKey="bonus"
            newValue={{
              description: '',
              is_qualified: false,
            }}
          />
        </InputWrap>
        <InputWrap>
          <InputLabel>職缺連結</InputLabel>
          <StyledInput
            type="text"
            defaultValue={values.job_link}
            onChange={handleChange('job_link')}
          />
        </InputWrap>
        <InputWrap>
          <InputLabel>我的履歷連結</InputLabel>
          <StyledInput
            type="text"
            defaultValue={values.resume_link}
            onChange={handleChange('resume_link')}
          />
        </InputWrap>
        <InputWrap>
          <InputLabel>
            我的其他檔案連結
            <SideNote>
              {' '}
              Ex: 個人網站 / 作品集 / CV / github 頁面.....等
            </SideNote>
          </InputLabel>
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
          <AddField
            setter={setValues}
            objectKey="attached_files"
            newValue={{
              file_name: '',
              file_link: '',
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
          onClick={nextStep}
        >
          下一頁
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DetailsStep2;
