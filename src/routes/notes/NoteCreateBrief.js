import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

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
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  background: ${({ checked }) => (checked ? color.primary : '#E3E3E3')};
  border-radius: 20px;
  color: ${({ checked }) => (checked ? 'white' : '#707070')};
  line-height: 22px;
  margin-right: 15px;
  cursor: pointer;
  border: 1px solid #667080;
  text-align: center;
  padding-top: 5px;
  font-size: 14px;
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
        <PopoverHeader>???????????????</PopoverHeader>
        <PopoverBody>
          ???????????????????????????????????????????????? /
          ?????????????????????????????????????????????????????????????????????????????????????????????????????????
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const NoteCreateBrief = props => {
  const { nextStep, handleChange, values, setValues, createNote } = props;
  const { companies, jobTitles } = useOutletContext();
  const inputRef = useRef();
  const firstInputRef = useRef();
  const statusArray = [
    '?????????',
    '?????????',
    '?????????',
    '?????????',
    '?????????',
    '?????????',
  ];

  useEffect(() => {
    initMap(setValues, inputRef);
  });

  useEffect(() => {
    console.log(firstInputRef.current)
    if (!firstInputRef.current) return;
    firstInputRef.current.focus();
  }, []);

  const handleCheckboxChange = () => {
    setValues(prev => {
      return { ...prev, is_share: !values.is_share };
    });
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
            ???????????? <span style={{ color: 'red' }}>*</span>
          </RequiredInput>
          <SearchableInput
            firstInputRef={firstInputRef}
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
            ???????????? <span style={{ color: 'red' }}>*</span>
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
          <InputLabel>????????????</InputLabel>
          <StyledInput
            ref={inputRef}
            size="sm"
            value={values.address}
            onChange={handleChange('address')}
            placeholder="??????????????????????????? or ??????????????????"
          />
        </InputWrap>
        <div>
          <InputLabel>????????????????????????????????????</InputLabel>
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
            ??????
            <SideNote>
              {' '}
              Ex: ?????? / React / ?????????.....??????????????????????????????????????? 5 ??????
            </SideNote>
          </InputLabel>
          <StyledInput
            size="sm"
            defaultValue={values.tags.join(',')}
            placeholder="?????????,?????????????????????"
            onChange={handleTagsChange}
          />
        </InputWrap>
        <CheckBoxWrapper>
          <CheckBox
            type="checkbox"
            checked={values.is_share}
            onChange={handleCheckboxChange}
          />
          <p>??????????????????????????????????????????????????????</p>
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
          ????????????
        </Button>
        <Button
          size="lg"
          h={['2.2rem', null, null, '3rem']}
          fontSize={['16px', null, null, '1.125rem']}
          colorScheme="brand"
          borderRadius="full"
          onClick={nextStep}
        >
          ?????????
        </Button>
      </ButtonGroup>
    </>
  );
};

NoteCreateBrief.propTypes = {
  nextStep: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  noteDataBrief: PropTypes.object.isRequired,
  noteDetails: PropTypes.object.isRequired,
};

export default NoteCreateBrief;
