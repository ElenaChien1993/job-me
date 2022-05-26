import { Fragment, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import {
  Button,
  CloseButton,
  Divider,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as S from '../../style/CommonElement';
import EditableInputField from './EditableInputField';
import AddField from '../elements/AddField';
import EditFiles from '../elements/EditFiles';
import { device } from '../../style/variable';
import firebase from '../../utils/firebase';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const StyledListItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const StyledLink = styled.a`
  margin-left: 10px;
  color: black;
  text-decoration: underline;
`;

const QuestionCardsWrapper = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr;
  @media ${device.laptop} {
    grid-template-columns: 1fr 1fr;
  }
`;

const QuestionCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background-color: rgba(243, 173, 95, 0.5);
  position: relative;
`;

const QuestionTitle = styled.div`
  & .chakra-editable__preview {
    font-weight: 700;
    font-size: 18px;
  }
`;

const CustomDeleteButton = styled(CloseButton)`
  && {
    position: absolute;
    right: 8px;
    top: 8px;
  }
`;

const Preparation = ({
  details,
  noteId,
  setDetails,
  onBlurSubmit,
  submitRef,
  handleDelete,
  handleMapArrayInputChange,
}) => {
  const [isFilesEditing, setIsFilesEditing] = useState(false);
  const { setError } = useOutletContext();
  const toast = useToast();

  const handleFilesSubmit = () => {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm;

    if (
      (!details.job_link.match(regex) && details.job_link !== '') ||
      (!details.resume_link.match(regex) && details.resume_link !== '')
    ) {
      toast({
        title: '請填寫正確的 URL 格式',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      firebase.updateNoteDetails(noteId, {
        job_link: details.job_link,
        resume_link: details.resume_link,
        attached_files: details.attached_files,
      });
      setIsFilesEditing(false);
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
    }
  };

  return (
    <>
      <S.FieldWrapper>
        <TitleWrapper>
          <S.Title>相關準備資料連結</S.Title>
          {!isFilesEditing ? (
            <IconButton
              colorScheme="brand"
              size="sm"
              onClick={() => setIsFilesEditing(true)}
              icon={<EditIcon />}
            />
          ) : (
            <Button colorScheme="brand" size="sm" onClick={handleFilesSubmit}>
              儲存
            </Button>
          )}
        </TitleWrapper>
        {!isFilesEditing ? (
          <S.Content>
            {details.job_link !== '' && (
              <StyledListItem>
                <S.Dot />
                <StyledLink href={details.job_link} target="_blank">
                  職缺連結
                </StyledLink>
              </StyledListItem>
            )}
            {details.resume_link !== '' && (
              <StyledListItem>
                <S.Dot />
                <StyledLink href={details.resume_link} target="_blank">
                  我的履歷連結
                </StyledLink>
              </StyledListItem>
            )}
            {details.attached_files.map((file, i) => {
              return (
                <Fragment key={file.file_link}>
                  {file.file_link !== '' && (
                    <StyledListItem key={file.file_link}>
                      <S.Dot />
                      <StyledLink href={file.file_link} target="_blank">
                        {file.file_name}
                      </StyledLink>
                    </StyledListItem>
                  )}
                </Fragment>
              );
            })}
          </S.Content>
        ) : (
          <>
            <EditFiles details={details} setDetails={setDetails} />
            <AddField
              setter={setDetails}
              objectKey="attached_files"
              newValue={{
                file_name: '請輸入檔案名稱',
                file_link: '請輸入檔案連結',
              }}
            />
          </>
        )}
      </S.FieldWrapper>
      <S.FieldWrapper>
        <S.Title>面試題目猜題</S.Title>
        <QuestionCardsWrapper>
          {details.questions.map((q, i) => {
            return (
              <QuestionCard key={q.question + i}>
                <QuestionTitle>
                  <EditableInputField
                    style={{ fontWeight: '700' }}
                    value={q.question}
                    onBlurSubmit={onBlurSubmit}
                    onSubmitCallback={handleMapArrayInputChange}
                    callbackArgs={{
                      objectKey: 'questions',
                      subKey: 'question',
                    }}
                    i={i}
                    submitRef={submitRef}
                  />
                </QuestionTitle>
                <Divider />
                <CustomDeleteButton
                  aria-label="delete item"
                  onClick={() => handleDelete(i, 'questions')}
                />
                <EditableInputField
                  value={q.answer}
                  onBlurSubmit={onBlurSubmit}
                  onSubmitCallback={handleMapArrayInputChange}
                  callbackArgs={{
                    objectKey: 'questions',
                    subKey: 'answer',
                  }}
                  i={i}
                  submitRef={submitRef}
                />
              </QuestionCard>
            );
          })}
          <AddField
            setter={setDetails}
            objectKey="questions"
            newValue={{
              question: '新欄位，請點擊編輯',
              answer: '請輸入練習回答',
            }}
          />
        </QuestionCardsWrapper>
      </S.FieldWrapper>
    </>
  );
};

Preparation.propTypes = {
  details: PropTypes.object,
  noteId: PropTypes.string,
  setDetails: PropTypes.func,
  onBlurSubmit: PropTypes.func,
  submitRef: PropTypes.object,
  handleDelete: PropTypes.func,
  handleMapArrayInputChange: PropTypes.func,
};

export default Preparation;
