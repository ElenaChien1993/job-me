import { useState } from 'react';
import { Flex, Button, Icon } from '@chakra-ui/react';
import { BiCircle } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import styled from 'styled-components';

import NoteCreateBrief from './NoteCreateBrief';
import DetailsStep1 from './DetailsStep1';
import DetailsStep2 from './DetailsStep2';
import DetailsStep3 from './DetailsStep3';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 80%;
  max-width: 1152px;
  background: #ffffff;
  border-radius: 30px;
  margin: 40px auto;
  position: relative;
  min-height: 650px;
`;

const LeftWrapper = styled.div`
  position: absolute;
  width: 35%;
  height: 100%;
  left: 0;
  top: 0;
  background: #306172;
  border-radius: 30px 0px 0px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  justify-content: space-around;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 65%;
  margin-left: 35%;
  padding: 40px 44px 60px;
`

const StyledIcon = styled(Icon)`
  width: 35px;
  height: 35px;
  margin-right: 10px;
  color: ${(props) => (props.isComplete ? 'white' : '#214552')};
`;

const StepText = styled.p`
  color: ${(props) => (props.isComplete ? 'white' : '#214552')};
  font-size: 20px;
  font-weight: bold;
`;

const StraightLine = styled.div`
  width: 3px;
  height: 30px;
  margin: 3px 0;
  margin-left: 16px;
  background-color: ${(props) => (props.isComplete ? 'white' : '#214552')};
`;

const CTEATE_STEP = props => ({
  1: <NoteCreateBrief {...props}/>,
  2: <DetailsStep1 {...props}/>,
  3: <DetailsStep2 {...props}/>,
  4: <DetailsStep3 {...props}/>,
})

const NoteCreate = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    company_name: '',
    job_title: '',
    is_share: true,
    address: '',
    status: '未申請',
    tags: [],
    product: '',
    job_link: '',
    resume_link: '',
    salary: {
      range: '',
      type: '',
    },
    responsibilities: [],
    requirements: [{ is_qualified: false, description: '' }],
    bonus: [{ is_qualified: false, description: '' }],
    questions: [],
    attached_files: [{ file_name: '', file_link: '' }],
    more_notes: [],
    other: '',
  });
  const navigate = useNavigate();

  const {
    company_name,
    address,
    is_share,
    tags,
    status,
    job_title,
    ...noteDetails
  } = values;

  const {
    product,
    job_link,
    resume_link,
    salary,
    responsibilities,
    requirements,
    bonus,
    questions,
    attached_files,
    more_notes,
    other,
    ...noteDataBrief
  } = values;

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleChange = (input) => (e) => {
    setValues((prev) => {
      return { ...prev, [input]: e.target.value };
    });
  };

  const handleCancel = () => {
    navigate('/notes');
  };

  const props = {
    nextStep,
    prevStep,
    handleChange,
    values,
    setValues,
    noteDataBrief,
    noteDetails,
  }

  return (
    <Container>
      <LeftWrapper>
        <Flex flexDir="column" align="start">
          <Flex align="center" justify="center">
            <StyledIcon as={BsCheckCircleFill} isComplete />
            <StepText isComplete>基本資料</StepText>
          </Flex>
          <StraightLine isComplete />
          <Flex align="center" justify="center">
            <StyledIcon
              as={step !== 1 ? BsCheckCircleFill : BiCircle}
              isComplete={step !== 1}
            />
            <StepText isComplete={step !== 1}>詳細資訊</StepText>
          </Flex>
          <StraightLine isComplete={step !== 1} />
          <Flex align="center" justify="center">
            <StyledIcon
              as={step === 4 ? BsCheckCircleFill : BiCircle}
              isComplete={step === 4}
            />
            <StepText isComplete={step === 4}>事前準備小記</StepText>
          </Flex>
        </Flex>
        <Flex align="center" textAlign="center" color="white">
          基本資料頁為創建筆記的必填項目，
          <br />
          其餘資訊可日後再編輯新增唷
        </Flex>
        <Button
          variant="outline"
          onClick={handleCancel}
          w="50%"
          style={{ color: 'white' }}
        >
          取消
        </Button>
      </LeftWrapper>
      <RightWrapper>
        {CTEATE_STEP(props)[step]}
      </RightWrapper>
      
    </Container>
  );
};

export default NoteCreate;
