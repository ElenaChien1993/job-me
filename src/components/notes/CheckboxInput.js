import { useOutletContext } from 'react-router-dom';
import { CloseButton } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as S from '../../style/CommonElement';
import EditableInputField from './EditableInputField';
import AddField from '../elements/AddField';
import firebase from '../../utils/firebase';

const ListWrapper = styled.div`
  width: 100%;
`;

const DeleteButton = styled(CloseButton)`
  && {
    margin-left: auto;
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CheckBox = styled.input`
  height: 16px;
  width: 16px;
  cursor: pointer;
`;

const CheckboxInput = ({
  isPublic,
  noteId,
  objectKey,
  onBlurSubmit,
  handleDelete,
  details,
  setDetails,
  submitRef,
  handleMapArrayInputChange,
}) => {
  const { setError } = useOutletContext();

  const getCheckboxChangedValue = (index, objectKey) => {
    const updatedChecked = details[objectKey].map((item, i) =>
      index === i
        ? {
            ...item,
            is_qualified: !item.is_qualified,
          }
        : item
    );
    return updatedChecked;
  };

  const handleCheckboxChange = async (itemIndex, objectKey) => {
    const updatedChecked = getCheckboxChangedValue(itemIndex, objectKey);
    try {
      await firebase.updateNoteDetails(noteId, { [objectKey]: updatedChecked });
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
    }
  };

  return (
    <>
      {isPublic ? (
        <ListWrapper>
          {details[objectKey].length === 0
            ? '未填寫'
            : details[objectKey].map(item => {
                return (
                  <S.PublicListItem key={item.description}>
                    <S.PublicDot />
                    <S.Content>{item.description}</S.Content>
                  </S.PublicListItem>
                );
              })}
        </ListWrapper>
      ) : (
        <>
          <ListWrapper>
            {details[objectKey].map((item, i) => {
              return (
                <CheckBoxWrapper key={item.description}>
                  <CheckBox
                    type="checkbox"
                    checked={details[objectKey][i].is_qualified}
                    onChange={() => handleCheckboxChange(i, objectKey)}
                  />
                  <EditableInputField
                    value={item.description}
                    onBlurSubmit={onBlurSubmit}
                    onSubmitCallback={handleMapArrayInputChange}
                    callbackArgs={{
                      objectKey: objectKey,
                      subKey: 'description',
                    }}
                    i={i}
                    submitRef={submitRef}
                  />
                  <DeleteButton
                    aria-label="delete item"
                    onClick={() => handleDelete(i, objectKey)}
                  />
                </CheckBoxWrapper>
              );
            })}
          </ListWrapper>
          <AddField
            setter={setDetails}
            objectKey={objectKey}
            newValue={{
              description: '新欄位，請點擊編輯',
              is_qualified: false,
            }}
          />
        </>
      )}
    </>
  );
};

CheckboxInput.propTypes = {
  isPublic: PropTypes.bool,
  noteId: PropTypes.string,
  objectKey: PropTypes.string.isRequired,
  onBlurSubmit: PropTypes.func,
  handleDelete: PropTypes.func,
  details: PropTypes.object,
  setDetails: PropTypes.func,
  submitRef: PropTypes.object,
  handleMapArrayInputChange: PropTypes.func,
};

export default CheckboxInput;
