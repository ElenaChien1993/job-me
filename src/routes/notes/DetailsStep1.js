import styled from 'styled-components';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

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

  return (
    <Container>
      <LeftWrapper></LeftWrapper>
      <RightWrapper>
        <StyledForm>
          <InputWrap>
            <label>該公司主要產品 / 服務</label>
            <StyledInput type="text" onChange={handleChange('product')} />
          </InputWrap>
          <SalaryContainer>
            <label>薪資範圍</label>
            <SalaryWrap>
              <StyledInput
                type="text"
                placeholder="Ex:650-800"
                onChange={handleSalaryChange}
              />
              <StyledDiv>K / 千</StyledDiv>
              <TagsWrapper>
                {salaryTypes.map((type, i) => {
                  return (
                    <>
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
                    </>
                  );
                })}
              </TagsWrapper>
            </SalaryWrap>
          </SalaryContainer>
          <InputWrap>
            <label>Responsibilities（工作內容）</label>
            <InputGroup>
              <InputLeftAddon children='描述' />
              <StyledInput type='text' />
            </InputGroup>
            {/* <StyledInput type="text" onChange={handleChange('product')} /> */}
          </InputWrap>
        </StyledForm>
      </RightWrapper>
    </Container>
  );
};

export default DetailsStep1;
