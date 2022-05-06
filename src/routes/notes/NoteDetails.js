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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import {
  SmallCloseIcon,
  EditIcon,
  ChevronLeftIcon,
  AtSignIcon,
} from '@chakra-ui/icons';
import { MdPreview } from 'react-icons/md';
import styled from 'styled-components';

import NoteElement from '../../components/NoteCardEditable';
import firebase from '../../utils/firebase';
import AddField from '../../components/elements/AddField';
import EditFiles from '../../components/elements/EditFiles';
import EditorArea from '../../components/elements/Editor';
import RecommendModal from '../../components/RecommendModal';
import EditableInputField from '../../components/EditableInputField';
import { device, color } from '../../style/variable';

const Background = styled.div`
  margin: 30px auto 0;
  max-width: 1000px;
  @media ${device.mobileM} {
    width: 90%;
  }
  @media ${device.tablet} {
    width: 80%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: ${color.white};
  margin-bottom: 60px;
  position: relative;
  @media ${device.mobileM} {
    padding: 20px 20px 0;
  }
  @media ${device.tablet} {
    padding: 20px 40px 0;
  }
`;

const PublicButtons = styled.div`
  display: flex;
  align-items: center;
  @media ${device.mobileM} {
    position: static;
    justify-content: flex-end;
  }
  @media ${device.tablet} {
  }
  position: absolute;
  right: 40px;
  top: 32px;
`;

const DeleteButton = styled(IconButton)`
  && {
    margin-left: auto;
    height: 20px;
  }
  & svg {
    width: 15px;
    height: 15px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FieldWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  position: relative;
`;

const TitleSection = styled.div`
  position: relative;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #306172;
  z-index: 1;
  position: relative;
`;

const TitleBack = styled.div`
  height: 13px;
  position: absolute;
  top: 18px;
  left: 0;
  background-color: rgba(243,173,95,0.5);
  z-index: 0;
  width: 100%;
`;

const SalaryText = styled.div`
  font-size: 16px;
  margin: 0 10px;
`;

const Content = styled.div`
  font-size: 16px;
`;

const ListWrapper = styled.div`
  width: 100%;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${color.primary};
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuestionCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background-color: rgba(243,173,95,0.5);
  position: relative;
`;

const CustomDeleteButton = styled(IconButton)`
  && {
    height: 20px;
    position: absolute;
    right: 20px;
  }
  & svg {
    width: 15px;
    height: 15px;
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
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
  background-color: ${color.primary};
`;

const StyledLink = styled.a`
  margin-left: 10px;
  color: black;
  text-decoration: underline;
`;

const StyledListItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const StyledSalaryWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledEditable = styled(Editable)`
  && {
    min-width: 12%;
    margin-right: 10px;
  }
`;

const QuestionCardsWrapper = styled.div`
  display: grid;
  gap: 15px;
  @media ${device.mobileM} {
    grid-template-columns: 1fr;
  }
  @media ${device.laptop} {
    grid-template-columns: 1fr 1fr;
  }
`;

const QuestionTitle = styled.div`
  & .chakra-editable__preview {
    font-weight: 700;
    font-size: 18px;
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

  const tabs = ['公司資訊', '工作內容', '面試準備', '筆記心得'];

  useEffect(() => {
    firebase.getNote(currentUserId, noteId).then(snap => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then(snap => {
      setDetails(snap.data());
    });
    const unsubscribe = firebase.listenDetailsChange(noteId, doc => {
      setDetails(doc.data());
      console.log('database changed', doc.data());
    });

    return unsubscribe;
  }, [currentUserId, noteId]);

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

  const onBlurSubmit = objectKey => {
    firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
  };

  //-------- Handle Array of Strings
  const handleArrayInputChange = (value, index, objectKey) => {
    const update = getArrayChangedValue(value, index, objectKey);
    setDetails(prev => {
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
    setDetails(prev => {
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
    setDetails(prev => {
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
      .then(members => {
        setRecommend(members);
        setIsLoading(false);
      });
  };

  const openPreview = () => {
    window.open(`/public/${currentUserId}/${noteId}`, '_blank');
  };

  const togglePublic = () => {
    firebase.updateNoteBrief(currentUserId, noteId, {
      is_share: !brief.is_share,
    });
    setBrief(prev => {
      return { ...prev, is_share: !brief.is_share };
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
            color="#00403B"
            borderColor="#00403B"
          >
            回前頁
          </Button>
        </Link>
        <Button
          size="sm"
          rightIcon={<AtSignIcon />}
          variant="solid"
          colorScheme="brand"
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
          <PublicButtons>
            {brief.is_share && (
              <Tooltip
                hasArrow
                label="預覽公開頁面"
                bg="gray.300"
                color="black"
              >
                <IconButton
                  color={color.primary}
                  aria-label="Open Preview"
                  icon={<MdPreview />}
                  mr="10px"
                  onClick={openPreview}
                />
              </Tooltip>
            )}
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={togglePublic}
            >
              {brief.is_share ? '公開中' : '隱藏中'}
            </Button>
          </PublicButtons>
          <Tabs
            variant="soft-rounded"
            colorScheme="brand"
          >
            <TabList>
              {tabs.map((tab, i) => {
                return (
                  <Tab
                    key={i}
                    borderRadius={['18px', null, null, 'full']}
                    p={['9px', null, null, '10px 15px']}
                    m="10px"
                    fontSize={['16px', null, null, '18px']}
                  >
                    {tab}
                  </Tab>
                );
              })}
            </TabList>
            <Line />
            <TabPanels>
              <TabPanel>
                <FieldWrapper>
                  <Title>公司主要產品 / 服務</Title>
                  <Editable
                    defaultValue={
                      details.product === '' ? '尚未填寫資料' : details.product
                    }
                    onSubmit={() => onBlurSubmit('product')}
                  >
                    <EditablePreview />
                    <EditableInput
                      onChange={e =>
                        setDetails(prev => {
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
                        onChange={e => handleInputSalaryChange(e, 'range')}
                      />
                    </StyledEditable>
                    <SalaryText> K </SalaryText>
                    <Select
                      variant="outline"
                      isFullWidth={false}
                      maxWidth="100px"
                      onChange={e => handleInputSalaryChange(e, 'type')}
                      onBlur={() => onBlurSubmit('salary')}
                    >
                      <option value="年薪">年薪</option>
                      <option value="月薪">月薪</option>
                    </Select>
                  </StyledSalaryWrapper>
                </FieldWrapper>
              </TabPanel>
              <TabPanel>
                <FieldWrapper>
                  <TitleSection>
                    <Title>工作內容</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.responsibilities.map((item, i) => {
                      return (
                        <ListItem key={item}>
                          <Dot />
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
                            icon={<SmallCloseIcon />}
                            onClick={() => handleDelete(i, 'responsibilities')}
                          />
                        </ListItem>
                      );
                    })}
                  </ListWrapper>
                  <AddField
                    setter={setDetails}
                    objectKey="responsibilities"
                    newValue={'新欄位，請點擊編輯'}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>必備技能</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.requirements.map((item, i) => {
                      return (
                        <CheckBoxWrapper key={item.description}>
                          <CheckBox
                            type="checkbox"
                            checked={details.requirements[i].is_qualified}
                            onChange={() =>
                              handleCheckboxChange(i, 'requirements')
                            }
                          />
                          <EditableInputField
                            value={item.description}
                            onBlurSubmit={onBlurSubmit}
                            onSubmitCallback={handleMapArrayInputChange}
                            callbackArgs={{
                              objectKey: 'requirements',
                              subKey: 'description',
                            }}
                            i={i}
                            submitRef={submitRef}
                          />
                          <DeleteButton
                            aria-label="delete item"
                            icon={<SmallCloseIcon />}
                            onClick={() => handleDelete(i, 'requirements')}
                          />
                        </CheckBoxWrapper>
                      );
                    })}
                  </ListWrapper>
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
                  <TitleSection>
                    <Title>加分項目</Title>
                    <TitleBack />
                  </TitleSection>
                  <ListWrapper>
                    {details.bonus.map((item, i) => {
                      return (
                        <CheckBoxWrapper key={item.description}>
                          <CheckBox
                            type="checkbox"
                            checked={details.bonus[i].is_qualified}
                            onChange={() => handleCheckboxChange(i, 'bonus')}
                          />
                          <EditableInputField
                            value={item.description}
                            onBlurSubmit={onBlurSubmit}
                            onSubmitCallback={handleMapArrayInputChange}
                            callbackArgs={{
                              objectKey: 'bonus',
                              subKey: 'description',
                            }}
                            i={i}
                            submitRef={submitRef}
                          />
                          <DeleteButton
                            aria-label="delete item"
                            icon={<SmallCloseIcon />}
                            onClick={() => handleDelete(i, 'bonus')}
                          />
                        </CheckBoxWrapper>
                      );
                    })}
                  </ListWrapper>
                  <AddField
                    setter={setDetails}
                    objectKey="bonus"
                    newValue={{
                      description: '新欄位，請點擊編輯',
                      is_qualified: false,
                    }}
                  />
                </FieldWrapper>
              </TabPanel>
              <TabPanel>
                <FieldWrapper>
                  <TitleWrapper>
                    <Title>相關準備資料連結</Title>
                    {!isFilesEditing ? (
                      <IconButton
                        colorScheme="brand"
                        size="sm"
                        onClick={() => setIsFilesEditing(true)}
                        icon={<EditIcon />}
                      />
                    ) : (
                      <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={handleFilesSubmit}
                      >
                        儲存
                      </Button>
                    )}
                  </TitleWrapper>
                  {!isFilesEditing ? (
                    <Content>
                      <StyledListItem>
                        <Dot />
                        <StyledLink href={details.job_link} target="_blank">
                          職缺連結
                        </StyledLink>
                      </StyledListItem>
                      <StyledListItem>
                        <Dot />
                        <StyledLink href={details.resume_link} target="_blank">
                          我的履歷連結
                        </StyledLink>
                      </StyledListItem>
                      {details.attached_files.map((file, i) => {
                        return (
                          <React.Fragment key={file.file_link}>
                            <StyledListItem>
                              <Dot />
                              <StyledLink href={file.file_link} target="_blank">
                                {file.file_name}
                              </StyledLink>
                              <DeleteButton
                                aria-label="delete item"
                                icon={<SmallCloseIcon />}
                                onClick={() =>
                                  handleDelete(i, 'attached_files')
                                }
                              />
                            </StyledListItem>
                          </React.Fragment>
                        );
                      })}
                    </Content>
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
                </FieldWrapper>
                <FieldWrapper>
                  <Title>面試題目猜題</Title>
                  <QuestionCardsWrapper>
                    {details.questions.map((q, i) => {
                      return (
                        <QuestionCard key={q.question}>
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
                            icon={<SmallCloseIcon />}
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
                </FieldWrapper>
              </TabPanel>
              <TabPanel>
                <FieldWrapper>
                  <TitleSection>
                    <Title>面試前筆記區</Title>
                    <TitleBack />
                  </TitleSection>
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
                  <TitleSection>
                    <Title>面試中筆記區</Title>
                    <TitleBack />
                  </TitleSection>
                  <EditorArea
                    noteId={noteId}
                    details={details}
                    objectKey="ing_note"
                  />
                </FieldWrapper>
                <FieldWrapper>
                  <TitleSection>
                    <Title>面試後心得區</Title>
                    <TitleBack />
                  </TitleSection>
                  <EditorArea
                    noteId={noteId}
                    details={details}
                    objectKey="after_note"
                  />
                </FieldWrapper>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}
    </Background>
  );
};

export default NoteDetails;
