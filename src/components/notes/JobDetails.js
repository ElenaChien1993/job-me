import { Fragment } from 'react';

import { CloseButton } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as S from '../../style/CommonElement';
import EditableInputField from './EditableInputField';
import AddField from '../elements/AddField';
import CheckboxInput from './CheckboxInput';

const ListWrapper = styled.div`
  width: 100%;
`;

const DeleteButton = styled(CloseButton)`
  && {
    margin-left: auto;
  }
`;

const JobDetails = ({
  isPublic,
  noteId,
  details,
  setDetails,
  submitRef,
  onBlurSubmit,
  handleDelete,
  handleMapArrayInputChange,
}) => {
  const sections = [
    ['必備技能', 'requirements'],
    ['加分項目', 'bonus'],
  ];

  const getArrayChangedValue = (value, index, objectKey) => {
    const update = details[objectKey].map((item, i) =>
      index === i ? value : item
    );
    return update;
  };

  const handleArrayInputChange = (value, index, objectKey) => {
    const update = getArrayChangedValue(value, index, objectKey);
    setDetails(prev => {
      return { ...prev, [objectKey]: update };
    });
  };

  return (
    <>
      <S.FieldWrapper>
        <S.TitleSection>
          <S.Title>工作內容</S.Title>
          <S.TitleBack />
        </S.TitleSection>
        <ListWrapper>
          {isPublic && details.responsibilities.length === 0 && '未填寫'}
          {details.responsibilities.map((item, i) => {
            return (
              <Fragment key={item}>
                {isPublic ? (
                  <S.PublicListItem>
                    <S.PublicDot />
                    <S.Content>{item}</S.Content>
                  </S.PublicListItem>
                ) : (
                  <S.ListItem>
                    <S.Dot />
                    <EditableInputField
                      value={item}
                      onBlurSubmit={onBlurSubmit}
                      onSubmitCallback={handleArrayInputChange}
                      callbackArgs={{ objectKey: 'responsibilities' }}
                      i={i}
                      submitRef={submitRef}
                    />
                    <DeleteButton
                      aria-label="delete item"
                      onClick={() => handleDelete(i, 'responsibilities')}
                    />
                  </S.ListItem>
                )}
              </Fragment>
            );
          })}
        </ListWrapper>
        {!isPublic && (
          <AddField
            setter={setDetails}
            objectKey="responsibilities"
            newValue={'新欄位，請點擊編輯'}
          />
        )}
      </S.FieldWrapper>
      {sections.map(section => (
        <S.FieldWrapper key={section[1]}>
          <S.TitleSection>
            <S.Title>{section[0]}</S.Title>
            <S.TitleBack />
          </S.TitleSection>
          <CheckboxInput
            isPublic={isPublic}
            noteId={noteId}
            objectKey={section[1]}
            onBlurSubmit={onBlurSubmit}
            handleDelete={handleDelete}
            details={details}
            setDetails={setDetails}
            submitRef={submitRef}
            handleMapArrayInputChange={handleMapArrayInputChange}
          />
        </S.FieldWrapper>
      ))}
    </>
  );
};

JobDetails.propTypes = {
  isPublic: PropTypes.bool,
  noteId: PropTypes.string,
  details: PropTypes.object,
  setDetails: PropTypes.func,
  submitRef: PropTypes.object,
  onBlurSubmit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleMapArrayInputChange: PropTypes.func,
};

export default JobDetails;
