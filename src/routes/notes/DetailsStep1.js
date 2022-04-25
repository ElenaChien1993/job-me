import React from 'react';
import styled from 'styled-components';
import { Input, Textarea } from '@chakra-ui/react';

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

const SalaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const SalaryWrap = styled.div`
  display: flex;
  align-items: center;
  width: 75%;
  & input {
    margin-right: 10px;
  }
`;

const StyledDiv = styled.div`
  margin-right: 10px;
  width: 160px;
`;

const TagsWrapper = styled.div`
  display: flex;
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

const StyledText = styled(Textarea)`
  && {
    height: 140px;
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

const DetailsStep1 = ({
  nextStep,
  prevStep,
  handleChange,
  values,
  setValues,
}) => {
  const salaryTypes = ['月薪', '年薪'];

  const handleSalaryChange = (e) => {
    setValues((prev) => {
      return { ...prev, salary: { ...prev.salary, range: e.target.value } };
    });
  };

  const handleRadioChange = (e) => {
    setValues((prev) => {
      return { ...prev, salary: { ...prev.salary, type: e.target.value } };
    });
  };

  const handleResponsibilitiesInputChange = (e) => {
    const answerArray = e.target.value.split('\n');
    const filtered = answerArray.filter((ans) => ans !== '');
    setValues((prev) => {
      return { ...prev, responsibilities: filtered };
    });
  };

  const handleReqCheckboxChange = (item, itemIndex) => {
    const updatedChecked = values.requirements.map((item, index) =>
      index === itemIndex
        ? {
            ...item,
            is_qualified: !item.is_qualified,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, requirements: updatedChecked };
    });
  };

  const handleAddField = (e) => {
    e.preventDefault();
    setValues((prev) => {
      return {
        ...prev,
        requirements: [
          ...prev.requirements,
          { is_qualified: false, description: '' },
        ],
      };
    });
  };

  const handleReqInputChange = (i) => (e) => {
    const updatedDes = values.requirements.map((item, index) =>
      index === i
        ? {
            ...item,
            description: e.target.value,
          }
        : item
    );

    setValues((prev) => {
      return { ...prev, requirements: updatedDes };
    });
  };

  return (
    <RightWrapper>
      <StyledForm>
        <InputWrap>
          <label>該公司主要產品 / 服務</label>
          <StyledInput
            type="text"
            defaultValue={values.product}
            onChange={handleChange('product')}
          />
        </InputWrap>
        <SalaryContainer>
          <label>薪資範圍</label>
          <SalaryWrap>
            <StyledInput
              type="text"
              defaultValue={values.salary.range}
              placeholder="Ex:650-800"
              onChange={handleSalaryChange}
            />
            <StyledDiv>K / 千</StyledDiv>
            <TagsWrapper>
              {salaryTypes.map((type, i) => {
                return (
                  <React.Fragment key={i}>
                    <RadioInput
                      type="radio"
                      id={`radio-${i}`}
                      name="type"
                      value={type}
                      key={i}
                      onChange={handleRadioChange}
                      checked={values.salary.type === type}
                    />
                    <TagButton
                      checked={values.salary.type === type}
                      key={`label${i}`}
                      htmlFor={`radio-${i}`}
                    >
                      {type}
                    </TagButton>
                  </React.Fragment>
                );
              })}
            </TagsWrapper>
          </SalaryWrap>
        </SalaryContainer>
        <InputWrap>
          <label>Responsibilities（工作內容）</label>
          <StyledText
            onChange={handleResponsibilitiesInputChange}
            placeholder="請將每個項目分行隔開"
            size="md"
            defaultValue={values.responsibilities.join('\n')}
          />
        </InputWrap>
        <InputWrap>
          <label>Requirements（必備技能）</label>
          {values.requirements.map((req, i) => {
            return (
              <RequirementWrapper key={i}>
                <CheckBox
                  type="checkbox"
                  checked={values.requirements[i].is_qualified}
                  onChange={() => handleReqCheckboxChange(req, i)}
                />
                <StyledInput
                  type="text"
                  defaultValue={values.requirements[i].description}
                  onChange={handleReqInputChange(i)}
                />
              </RequirementWrapper>
            );
          })}
          <StyledAddButton onClick={handleAddField}>＋新增欄位</StyledAddButton>
        </InputWrap>
      </StyledForm>
      <StyledButton onClick={prevStep}>上一頁</StyledButton>
      <StyledButton onClick={nextStep}>下一頁</StyledButton>
    </RightWrapper>
  );
};

export default DetailsStep1;
