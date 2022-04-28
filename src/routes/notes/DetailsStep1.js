import React from 'react';
import styled from 'styled-components';
import { Button, Input, Textarea } from '@chakra-ui/react';
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

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailsStep1 = ({
  nextStep,
  prevStep,
  handleChange,
  values,
  setValues,
}) => {
  const salaryTypes = ['月薪', '年薪'];

  const handleSalaryChange = e => {
    setValues(prev => {
      return { ...prev, salary: { ...prev.salary, range: e.target.value } };
    });
  };

  const handleRadioChange = e => {
    setValues(prev => {
      return { ...prev, salary: { ...prev.salary, type: e.target.value } };
    });
  };

  const handleResponsibilitiesInputChange = e => {
    const answerArray = e.target.value.split('\n');
    const filtered = answerArray.filter(ans => ans !== '');
    setValues(prev => {
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

    setValues(prev => {
      return { ...prev, requirements: updatedChecked };
    });
  };

  const handleAddField = e => {
    e.preventDefault();
    setValues(prev => {
      return {
        ...prev,
        requirements: [
          ...prev.requirements,
          { is_qualified: false, description: '' },
        ],
      };
    });
  };

  const handleReqInputChange = i => e => {
    const updatedDes = values.requirements.map((item, index) =>
      index === i
        ? {
            ...item,
            description: e.target.value,
          }
        : item
    );

    setValues(prev => {
      return { ...prev, requirements: updatedDes };
    });
  };

  return (
    <>
      <>
        <InputWrap>
          <InputLabel>該公司主要產品 / 服務</InputLabel>
          <StyledInput
            type="text"
            defaultValue={values.product}
            onChange={handleChange('product')}
          />
        </InputWrap>
        <SalaryContainer>
          <InputLabel>薪資範圍</InputLabel>
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
          <InputLabel>Responsibilities（工作內容）</InputLabel>
          <StyledText
            onChange={handleResponsibilitiesInputChange}
            placeholder="請將每個項目分行隔開"
            size="md"
            defaultValue={values.responsibilities.join('\n')}
          />
        </InputWrap>
        <InputWrap>
          <InputLabel>Requirements（必備技能）</InputLabel>
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
          <AddField
            setter={setValues}
            objectKey="requirements"
            newValue={{
              description: '',
              is_qualified: false,
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

export default DetailsStep1;
