import React, { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Input,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  useToast,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import SearchableInput from '../../components/SearchableInput';
import { device, color } from '../../style/variable';
import { initMap } from '../../components/GoogleSearch';

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 32px;
  position: relative;
`;

const InputLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  flex-direction: column;
`;

const RequiredInput = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 18px;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    height: 40px;
  }
`;

const TagsWrapper = styled.div`
  margin: 8px 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
`;

const RadioInput = styled.input`
  opacity: 0;
  position: fixed;
  width: 0;
`;

const TagButton = styled.label`
  width: 90px;
  height: 35px;
  background: ${props => (props.checked ? color.primary : '#E3E3E3')};
  border-radius: 20px;
  color: ${props => (props.checked ? 'white' : '#707070')};
  line-height: 22px;
  margin-right: 15px;
  cursor: pointer;
  border: 1px solid #667080;
  text-align: center;
  padding-top: 5px;
  @media ${device.mobileM} {
    font-size: 14px;
  }
  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const CheckBoxWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 30px 0;
  & p {
    font-size: 18px;
    font-weight: 500;
  }
`;

const CheckBox = styled.input`
  height: 25px;
  width: 25px;
  background: ${color.primary};
  color: white;
  margin-right: 15px;
  cursor: pointer;
`;

const SideNote = styled.span`
  color: #999999;
  margin-left: 5px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoPopup = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="more info"
          color={color.secondary}
          variant="ghost"
          icon={<QuestionIcon />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>什麼意思？</PopoverHeader>
        <PopoverBody>
          如果勾選此選項，其他會員可在推薦 /
          搜尋找到您，便可交流面試經驗；若未勾選，則此筆記將不會為您推薦其他會員
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const NoteCreateBrief = props => {
  const {
    nextStep,
    handleChange,
    values,
    setValues,
    noteDataBrief,
    noteDetails,
  } = props;
  const { currentUserId, companies, setCompanies, jobTitles, setJobTitles } =
    useOutletContext();
  const inputRef = useRef();
  const navigate = useNavigate();
  const statusArray = [
    '未申請',
    '已申請',
    '未錄取',
    '已錄取',
    '無聲卡',
    '等待中',
  ];
  const toast = useToast();

  useEffect(() => {
    if (companies) return;
    firebase.getWholeCollection('companies').then(data => {
      setCompanies(data);
    });
    if (jobTitles) return;
    firebase.getWholeCollection('job_titles').then(data => {
      setJobTitles(data);
    });
    // initMap(setValues, inputRef);
  }, []);

  useEffect(() => {
    initMap(setValues, inputRef);
  });

  const handleCheckboxChange = () => {
    setValues(prev => {
      return { ...prev, is_share: !values.is_share };
    });
  };

  const createNote = async () => {
    if (values.company_name === '' || values.job_title === '') {
      toast({
        title: '哎呀',
        description: '公司名稱和應徵職稱為必填欄位',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    const noteId = await firebase.setNoteBrief(currentUserId, {
      ...noteDataBrief,
      creator: currentUserId,
    });
    const notes = await firebase.getNotes(currentUserId);
    firebase.updateUserInfo(currentUserId, { notes_qty: notes.length });

    await firebase.setNoteDetails(noteId, noteDetails);

    if (
      companies.map(company => company.name).indexOf(values.company_name) === -1
    ) {
      await firebase.createDoc('companies', { name: values.company_name });
    }
    if (jobTitles.map(job => job.name).indexOf(values.job_title) === -1) {
      await firebase.createDoc('job_titles', { name: values.job_title });
    }

    navigate(`/notes/details/${noteId}`);
  };

  const handleTagsChange = e => {
    const tagsArray = e.target.value.split(',', 5);
    setValues(prev => {
      return { ...prev, tags: tagsArray };
    });
  };

  return (
    <>
      <>
        <InputWrap>
          <RequiredInput>
            公司名稱 <span style={{ color: 'red' }}>*</span>
          </RequiredInput>
          <SearchableInput
            value={values.company_name}
            setValue={value => {
              setValues(prev => {
                return { ...prev, company_name: value };
              });
            }}
            data={companies}
          />
        </InputWrap>
        <InputWrap>
          <RequiredInput>
            應徵職務 <span style={{ color: 'red' }}>*</span>
          </RequiredInput>
          <SearchableInput
            value={values.job_title}
            setValue={value => {
              setValues(prev => {
                return { ...prev, job_title: value };
              });
            }}
            data={jobTitles}
          />
        </InputWrap>
        <InputWrap>
          <InputLabel>公司地點</InputLabel>
          <StyledInput
            ref={inputRef}
            size="sm"
            value={values.address}
            onChange={handleChange('address')}
            placeholder="可輸入公司搜尋地址 or 直接輸入地址"
          />
        </InputWrap>
        <div>
          <InputLabel>目前對於此公司的求職狀態</InputLabel>
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
          <InputLabel>
            標籤
            <SideNote>
              {' '}
              Ex: 新創 / React / 最想要.....等自訂標籤以利搜尋（上限為 5 個）
            </SideNote>
          </InputLabel>
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
          <InfoPopup />
        </CheckBoxWrapper>
      </>
      <ButtonGroup>
        <Button
          size="lg"
          h={['2.2rem', null, null, '3rem']}
          fontSize={['16px', null, null, '1.125rem']}
          colorScheme="brand"
          borderRadius="full"
          onClick={createNote}
        >
          直接創建
        </Button>
        <Button
          size="lg"
          h={['2.2rem', null, null, '3rem']}
          fontSize={['16px', null, null, '1.125rem']}
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

export default NoteCreateBrief;
