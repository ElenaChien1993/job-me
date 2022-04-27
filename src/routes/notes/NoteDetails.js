import { useParams, Link, useOutletContext } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  Select,
  IconButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import {
  SmallCloseIcon,
  EditIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  AtSignIcon,
} from '@chakra-ui/icons';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import NoteElement from '../../components/NoteCardEditable';
import firebase from '../../utils/firebase';
import AddField from '../../components/elements/AddField';
import EditFiles from '../../components/elements/EditFiles';
import EditorArea from '../../components/elements/Editor';
import RecommendModal from '../../components/RecommendModal';
import EditableInputField from '../../components/EditableInputField';

const Background = styled.div`
  margin: 30px 10% 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: white;
  padding: 20px 40px 0;
  margin-bottom: 60px;
`;

const DeleteButton = styled(IconButton)`
  ${
    '' /* && {
    display: none;
  } */
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FieldWrapper = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.p`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #cd5545;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #306172;
`;

const Content = styled.div`
  font-size: 16px;
  margin-right: 10px;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const CheckBox = styled.input`
  height: 16px;
  width: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const Line = styled.div`
  width: 100%;
  height: 5px;
  background-color: #306172;
  margin-bottom: 20px;
`;

const StyledLink = styled.a`
  color: black;
  text-decoration: underline;
`;

const StyledListItem = styled.li`
  margin-bottom: 10px;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const StyledSalaryWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledEditable = styled(Editable)`
  && {
    width: 10%;
    margin-right: 10px;
  }
`;

const QuestionWrapper = styled.div`
  margin-bottom: 15px;
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const NoteDetails = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [isFilesEditing, setIsFilesEditing] = useState(false);
  const [recommend, setRecommend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUserId } = useOutletContext();
  const submitRef = useRef();

  const { onOpen, isOpen, onClose } = useDisclosure({ id: 'recommend' });
  let params = useParams();
  const noteId = params.noteId;

  useEffect(() => {
    firebase.getNote(currentUserId, noteId).then((snap) => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then(snap => {
      setDetails(snap.data());
    });
    const unsubscribe = firebase.listenDetailsChange(noteId, (doc) => {
      setDetails(doc.data());
      console.log('database changed', doc.data());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!submitRef.current) return;
    onBlurSubmit(submitRef.current.key);
  }, [submitRef.current]);

  // ------- Helper Function
  const getArrayChangedValue = (value, index, objectKey) => {
    const update = details[objectKey].map((item, i) =>
      index === i ? value : item
    );
    return update;
  };

  const getObjectInArrayChangedValue = (value, index, objectKey, targetKey) => {
    const update = details[objectKey].map((item, i) =>
      index === i
        ? {
            ...item,
            [targetKey]: value,
          }
        : item
    );
    return update;
  };

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

  const onBlurSubmit = (objectKey) => {
    console.log('onBlurSubmit', details[objectKey]);
    // handleMapArrayInputChange(e, i, 'questions', 'question');
    firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
  };

  const handlePressEnter = (e, objectKey) => {
    if (e.keyCode === 13) {
      firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
    }
  };

  //-------- Handle Array of Strings
  const handleArrayInputChange = (value, index, objectKey) => {
    const update = getArrayChangedValue(value, index, objectKey);
    console.log('handleArrayInputChange function', update);
    setDetails((prev) => {
      return { ...prev, [objectKey]: update };
    });
  };

  // ------- Handle Array of Maps
  const handleMapArrayInputChange = (value, index, objectKey, targetKey) => {
    const update = getObjectInArrayChangedValue(
      value,
      index,
      objectKey,
      targetKey
    );
    setDetails((prev) => {
      return { ...prev, [objectKey]: update };
    });
  };

  // ------- Handle Checkbox
  const handleCheckboxChange = (itemIndex, objectKey) => {
    const updatedChecked = getCheckboxChangedValue(itemIndex, objectKey);

    firebase.updateNoteDetails(noteId, { [objectKey]: updatedChecked });
  };

  const handleDelete = (i, objectKey) => {
    const newData = details[objectKey].filter((_, index) => index !== i);
    firebase.updateNoteDetails(noteId, { [objectKey]: newData });
  };

  const handleInputSalaryChange = (e, type) => {
    setDetails((prev) => {
      return { ...prev, salary: { ...details.salary, [type]: e.target.value } };
    });
  };

  const handleFilesSubmit = () => {
    firebase.updateNoteDetails(noteId, {
      job_link: details.job_link,
      resume_link: details.resume_link,
      attached_files: details.attached_files,
    });
    setIsFilesEditing(false);
  };

  const showConnectModal = () => {
    setIsLoading(true);
    onOpen();
    firebase
      .getRecommendedUsers(brief.company_name, brief.job_title, currentUserId)
      .then((members) => {
        setRecommend(members);
        setIsLoading(false);
      });
  };

  return (
    <Background>
      <RecommendModal
        isOpen={isOpen}
        onClose={onClose}
        recommend={recommend}
        isLoading={isLoading}
      />
      <ButtonWrapper>
        <Link to="/notes">
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            variant="outline"
            colorScheme="teal"
          >
            回前頁
          </Button>
        </Link>
        <Button
          size="sm"
          rightIcon={<AtSignIcon />}
          variant="solid"
          colorScheme="facebook"
          onClick={showConnectModal}
        >
          查看其他相關會員
        </Button>
      </ButtonWrapper>
      {brief && (
        <NoteElement
          uid={currentUserId}
          noteId={noteId}
          note={brief}
          setNote={setBrief}
          editable
        />
      )}
      {details && (
        <Container>
          <SectionTitle>詳細資料</SectionTitle>
          <FieldWrapper>
            <Title>公司主要產品 / 服務</Title>
            <Editable
              value={details.product === '' ? '尚未填寫資料' : details.product}
              onSubmit={() => onBlurSubmit('product')}
            >
              <EditablePreview />
              <EditableInput
                onChange={(e) =>
                  setDetails((prev) => {
                    return { ...prev, product: e.target.value };
                  })
                }
              />
            </Editable>
          </FieldWrapper>
          <FieldWrapper>
            <Title>薪資範圍</Title>
            <StyledSalaryWrapper>
              <StyledEditable
                value={
                  details.salary.range === ''
                    ? '尚未填寫資料'
                    : details.salary.range
                }
                onSubmit={() => onBlurSubmit('salary')}
              >
                <EditablePreview />
                <EditableInput
                  onChange={(e) => handleInputSalaryChange(e, 'range')}
                />
              </StyledEditable>
              <Content> K </Content>
              <Select
                variant="outline"
                isFullWidth={false}
                maxWidth="100px"
                onChange={(e) => handleInputSalaryChange(e, 'type')}
                onBlur={() => onBlurSubmit('salary')}
              >
                <option value="年薪">年薪</option>
                <option value="月薪">月薪</option>
              </Select>
            </StyledSalaryWrapper>
          </FieldWrapper>
          <FieldWrapper>
            <Title>工作內容</Title>
            <Content>
              {details.responsibilities.map((item, i) => {
                return (
                  <div key={uuid()}>
                    <EditableInputField
                      value={item}
                      onBlurSubmit={onBlurSubmit}
                      onSubmitCallback={handleArrayInputChange}
                      callbackArgs={{objectKey: 'responsibilities'}}
                      i={i}
                      submitRef={submitRef}
                    />
                    <DeleteButton
                      w={4}
                      h={4}
                      ml={5}
                      aria-label="delete item"
                      icon={<SmallCloseIcon />}
                      onClick={() => handleDelete(i, 'responsibilities')}
                    />
                  </div>
                );
              })}
            </Content>
            <AddField
              setter={setDetails}
              objectKey="responsibilities"
              newValue={'新欄位，請點擊編輯'}
            />
          </FieldWrapper>
          <FieldWrapper>
            <Title>必備技能</Title>
            {details.requirements.map((item, i) => {
              return (
                <CheckBoxWrapper key={uuid()}>
                  <CheckBox
                    type="checkbox"
                    checked={details.requirements[i].is_qualified}
                    onChange={() => handleCheckboxChange(i, 'requirements')}
                  />
                  <EditableInputField
                    value={item.description}
                    onBlurSubmit={onBlurSubmit}
                    onSubmitCallback={handleMapArrayInputChange}
                    callbackArgs={{objectKey: 'requirements', subKey: 'description'}}
                    i={i}
                    submitRef={submitRef}
                  />
                  <DeleteButton
                    w={4}
                    h={4}
                    ml={5}
                    aria-label="delete item"
                    icon={<SmallCloseIcon />}
                    onClick={() => handleDelete(i, 'requirements')}
                  />
                </CheckBoxWrapper>
              );
            })}
            <AddField
              setter={setDetails}
              objectKey="requirements"
              newValue={{
                description: '新欄位，請點擊編輯',
                is_qualified: false,
              }}
            />
          </FieldWrapper>
          <FieldWrapper>
            <Title>加分項目</Title>
            {details.bonus.map((item, i) => {
              return (
                <CheckBoxWrapper key={uuid()}>
                  <CheckBox
                    type="checkbox"
                    checked={details.bonus[i].is_qualified}
                    onChange={() => handleCheckboxChange(i, 'bonus')}
                  />
                  <EditableInputField
                    value={item.description}
                    onBlurSubmit={onBlurSubmit}
                    onSubmitCallback={handleMapArrayInputChange}
                    callbackArgs={{objectKey: 'bonus', subKey: 'description'}}
                    i={i}
                    submitRef={submitRef}
                  />
                  <DeleteButton
                    w={4}
                    h={4}
                    ml={5}
                    aria-label="delete item"
                    icon={<SmallCloseIcon />}
                    onClick={() => handleDelete(i, 'bonus')}
                  />
                </CheckBoxWrapper>
              );
            })}
            <AddField
              setter={setDetails}
              objectKey="bonus"
              newValue={{
                description: '新欄位，請點擊編輯',
                is_qualified: false,
              }}
            />
          </FieldWrapper>
          <FieldWrapper>
            <Title>相關準備資料連結</Title>
            {!isFilesEditing ? (
              <Content>
                <IconButton
                  size="sm"
                  onClick={() => setIsFilesEditing(true)}
                  icon={<EditIcon />}
                />
                <StyledListItem>
                  <StyledLink href={details.job_link} target="_blank">
                    職缺連結
                  </StyledLink>
                </StyledListItem>
                <StyledListItem>
                  <StyledLink href={details.resume_link} target="_blank">
                    我的履歷連結
                  </StyledLink>
                </StyledListItem>
                {details.attached_files.map((file, i) => {
                  return (
                    <StyledListItem key={uuid()}>
                      <StyledLink href={file.file_link} target="_blank">
                        {file.file_name}
                      </StyledLink>
                      <DeleteButton
                        w={4}
                        h={4}
                        ml={5}
                        aria-label="delete item"
                        icon={<SmallCloseIcon />}
                        onClick={() => handleDelete(i, 'attached_files')}
                      />
                    </StyledListItem>
                  );
                })}
              </Content>
            ) : (
              <>
                <IconButton
                  size="sm"
                  onClick={handleFilesSubmit}
                  icon={<CheckCircleIcon />}
                />
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
          </FieldWrapper>
          <FieldWrapper>
            <Title>其他備註</Title>
            <EditorArea noteId={noteId} details={details} objectKey="other" />
            <Content>{details.others}</Content>
          </FieldWrapper>
          <Line />
          <SectionTitle>面試準備筆記</SectionTitle>
          <FieldWrapper>
            <Title>面試題目猜題</Title>
            <Content>
              {details.questions.map((q, i) => {
                return (
                  <QuestionWrapper key={uuid()}>
                    <EditableInputField
                      value={q.question}
                      onBlurSubmit={onBlurSubmit}
                      onSubmitCallback={handleMapArrayInputChange}
                      callbackArgs={{objectKey: 'questions', subKey: 'question'}}
                      i={i}
                      submitRef={submitRef}
                    />
                    <DeleteButton
                      w={4}
                      h={4}
                      ml={5}
                      aria-label="delete item"
                      icon={<SmallCloseIcon />}
                      onClick={() => handleDelete(i, 'questions')}
                    />
                    <EditableInputField
                      value={q.answer}
                      onBlurSubmit={onBlurSubmit}
                      onSubmitCallback={handleMapArrayInputChange}
                      callbackArgs={{objectKey: 'questions', subKey: 'answer'}}
                      i={i}
                      submitRef={submitRef}
                    />
                  </QuestionWrapper>
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
            </Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試前筆記區</Title>
            <Content>
              <div>Ex: 想問公司的問題？</div>
              <EditorArea
                noteId={noteId}
                details={details}
                objectKey="before_note"
              />
            </Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試中筆記區</Title>
            <EditorArea
              noteId={noteId}
              details={details}
              objectKey="ing_note"
            />
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試後心得區</Title>
            <EditorArea
              noteId={noteId}
              details={details}
              objectKey="after_note"
            />
          </FieldWrapper>
        </Container>
      )}
    </Background>
  );
};

export default NoteDetails;
