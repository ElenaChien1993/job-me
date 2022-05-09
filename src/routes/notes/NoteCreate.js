import { useState } from 'react';
import { Flex, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { BiCircle } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import styled from 'styled-components';

import NoteCreateBrief from './NoteCreateBrief';
import DetailsStep1 from './DetailsStep1';
import DetailsStep2 from './DetailsStep2';
import DetailsStep3 from './DetailsStep3';
import { useNavigate } from 'react-router-dom';
import { device, color } from '../../style/variable';
import AlertModal from '../../components/AlertModal';

const Container = styled.div`
  max-width: 1152px;
  @media ${device.mobileM} {
    width: 90%;
    margin: 20px auto;
  }
  @media ${device.laptop} {
    width: 80%;
    margin: 40px auto;
  }
`;

const Main = styled.div`
  max-width: 1152px;
  background: #ffffff;
  border-radius: 30px;
  position: relative;
  min-height: 650px;
  width: 100%;
`;

const LeftWrapper = styled.div`
  position: absolute;
  left: 0;
  background: ${color.primary};
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media ${device.mobileM} {
    flex-direction: row;
    width: 100%;
    height: 10%;
    border-radius: 30px 30px 0px 0px;
    top: -20px;
    padding: 20px 20px;
  }
  @media ${device.tablet} {
    flex-direction: column;
    width: 35%;
    height: 100%;
    border-radius: 30px 0px 0px 30px;
    top: 0;
    padding: 20px 10px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${device.mobileM} {
    padding: 0 22px 60px;
    width: 100%;
    height: 90%;
    padding-top: 23%;
  }
  @media ${device.tablet} {
    padding-top: 40px;
    width: 65%;
    height: 100%;
    margin-left: 35%;
  }
  @media ${device.laptop} {
    padding: 40px 44px 60px;
  }
`;

const StyledIcon = styled(Icon)`
  color: ${props => (props.isComplete ? 'white' : '#04608c')};
  @media ${device.mobileM} {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
  @media ${device.mobileL} {
    margin-right: 10px;
  }
  @media ${device.tablet} {
    width: 35px;
    height: 35px;
  }
`;

const StepText = styled.p`
  color: ${props => (props.isComplete ? 'white' : '#04608c')};
  font-size: 20px;
  font-weight: bold;
  cursor: default;
  @media ${device.mobileM} {
    font-size: 16px;
    line-height: 22px;
  }
  @media ${device.tablet} {
    font-size: 20px;
    line-height: 1.5;
  }
`;

const StraightLine = styled.div`
  width: 3px;
  height: 30px;
  margin: 3px 0;
  margin-left: 16px;
  background-color: ${props => (props.isComplete ? 'white' : '#04608c')};
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const CTEATE_STEP = props => ({
  1: <NoteCreateBrief {...props} />,
  2: <DetailsStep1 {...props} />,
  3: <DetailsStep2 {...props} />,
  4: <DetailsStep3 {...props} />,
});

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
      type: '年薪',
    },
    responsibilities: [],
    requirements: [{ is_qualified: false, description: '' }],
    bonus: [{ is_qualified: false, description: '' }],
    questions: [],
    attached_files: [{ file_name: '', file_link: '' }],
    other: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });
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
    other,
    ...noteDataBrief
  } = values;

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleChange = input => e => {
    setValues(prev => {
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
  };

  return (
    <Container>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        header="取消創建"
        content="目前設定與記錄將消失，確定要離開創建頁面嗎？"
        actionText="確定"
        action={handleCancel}
      />
      <Button
        display={['block', null, null, 'none']}
        variant="outline"
        onClick={onOpen}
        w="20%"
        colorScheme="brand"
        mb="40px"
      >
        取消
      </Button>
      <Main>
        <LeftWrapper>
          <Flex
            w={['100%', null, null, 'auto']}
            flexDir={['row', null, null, 'column']}
            align={['center', null, null, 'start']}
            justify={['space-around', null, null, 'center']}
          >
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
              <StepText isComplete={step === 4}>準備小記</StepText>
            </Flex>
          </Flex>
          <Flex
            display={['none', null, null, 'flex']}
            align="center"
            textAlign="center"
            color="white"
          >
            公司名稱和應徵職稱為創建筆記的必填項目，
            <br />
            其餘資訊可日後再編輯新增唷
          </Flex>
          <Button
            display={['none', null, null, 'inline-flex']}
            variant="outline"
            onClick={onOpen}
            w="50%"
            style={{ color: 'white' }}
          >
            取消
          </Button>
        </LeftWrapper>
        <RightWrapper>{CTEATE_STEP(props)[step]}</RightWrapper>
      </Main>
    </Container>
  );
};

export default NoteCreate;
