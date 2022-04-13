import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Select,
  IconButton,
} from '@chakra-ui/react';
import { SmallCloseIcon, EditIcon, CheckCircleIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import NoteElement from '../../components/NoteElement';
import firebase from '../../utils/firebase';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import AddField from '../../components/AddField';
import EditFiles from '../../components/EditFiles';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: white;
  padding: 20px 40px 0;
  margin-bottom: 60px;
`;

const DeleteButton = styled(IconButton)`
  && {
    display: none;
  }
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

const NoteDetails = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [isFilesEditing, setIsFilesEditing] = useState(false);

  let params = useParams();
  const noteId = params.noteId;
  const user = firebase.auth.currentUser;

  useEffect(() => {
    firebase.getNote(user.uid, noteId).then((snap) => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then((snap) => {
      setDetails(snap.data());
    });
    firebase.listenDetailsChange(noteId, (doc) => {
      setDetails(doc.data());
    });
  }, []);

  useUpdateEffect(() => {
    // firebase.getRecommendedUsers('company').then(snaps => {
    //   snaps.forEach(doc => console.log(doc.data()));
    // });
  }, details);

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
    firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
  };

  const handlePressEnter = (e, objectKey) => {
    if (e.keyCode === 13) {
      firebase.updateNoteDetails(noteId, { [objectKey]: details[objectKey] });
    }
  };

  //-------- Handle Array of Strings
  const handleArrayInputChange = (e, index, objectKey) => {
    const update = getArrayChangedValue(e.target.value, index, objectKey);

    setDetails((prev) => {
      return { ...prev, [objectKey]: update };
    });
  };

  // ------- Handle Array of Maps
  const handleMapArrayInputChange = (e, index, objectKey, targetKey) => {
    const update = getObjectInArrayChangedValue(
      e.target.value,
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

  console.log('state', details);

  return (
    <>
      {brief && <NoteElement note={brief} />}
      {details && (
        <Container>
          <SectionTitle>詳細資料</SectionTitle>
          <FieldWrapper>
            <Title>公司主要產品 / 服務</Title>
            <Editable value={details.product}>
              <EditablePreview />
              <EditableInput
                onChange={(e) =>
                  setDetails((prev) => {
                    return { ...prev, product: e.target.value };
                  })
                }
                onBlur={() => onBlurSubmit('product')}
                onKeyDown={(e) => handlePressEnter(e, 'product')}
              />
            </Editable>
          </FieldWrapper>
          <FieldWrapper>
            <Title>薪資範圍</Title>
            <StyledSalaryWrapper>
              <StyledEditable value={details.salary.range}>
                <EditablePreview />
                <EditableInput
                  onChange={(e) => handleInputSalaryChange(e, 'range')}
                  onBlur={() => onBlurSubmit('salary')}
                  onKeyDown={(e) => handlePressEnter(e, 'salary')}
                />
              </StyledEditable>
              <Content> K </Content>
              <Select
                variant="outline"
                isFullWidth={false}
                maxWidth="100px"
                onChange={(e) => handleInputSalaryChange(e, 'type')}
                // placeholder={details.salary.type}
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
                  <Editable value={item} key={i}>
                    <StyledListItem>
                      <EditablePreview />
                      <EditableInput
                        onChange={(e) =>
                          handleArrayInputChange(e, i, 'responsibilities')
                        }
                        onBlur={() => onBlurSubmit('responsibilities')}
                        onKeyDown={(e) =>
                          handlePressEnter(e, 'responsibilities')
                        }
                      />
                      <DeleteButton
                        w={4}
                        h={4}
                        ml={5}
                        aria-label="delete item"
                        icon={<SmallCloseIcon />}
                        onClick={() => handleDelete(i, 'responsibilities')}
                      />
                    </StyledListItem>
                  </Editable>
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
                <CheckBoxWrapper key={i}>
                  <CheckBox
                    type="checkbox"
                    checked={details.requirements[i].is_qualified}
                    onChange={() => handleCheckboxChange(i, 'requirements')}
                  />
                  <Editable value={item.description}>
                    <EditablePreview />
                    <EditableInput
                      onChange={(e) =>
                        handleMapArrayInputChange(
                          e,
                          i,
                          'requirements',
                          'description'
                        )
                      }
                      onBlur={() => onBlurSubmit('requirements')}
                      onKeyDown={(e) => handlePressEnter(e, 'requirements')}
                    />
                  </Editable>
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
                <CheckBoxWrapper key={i}>
                  <CheckBox
                    type="checkbox"
                    checked={details.bonus[i].is_qualified}
                    onChange={() => handleCheckboxChange(i, 'bonus')}
                  />
                  <Editable value={item.description}>
                    <EditablePreview />
                    <EditableInput
                      onChange={(e) =>
                        handleMapArrayInputChange(e, i, 'bonus', 'description')
                      }
                      onBlur={() => onBlurSubmit('bonus')}
                      onKeyDown={(e) => handlePressEnter(e, 'bonus')}
                    />
                  </Editable>
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
                    <StyledListItem key={i}>
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
            <Content>{details.others}</Content>
          </FieldWrapper>
          <Line />
          <SectionTitle>面試準備筆記</SectionTitle>
          <FieldWrapper>
            <Title>面試題目猜題</Title>
            <Content>
              {details.questions.map((q, i) => {
                return <StyledListItem key={i}>{q.question}</StyledListItem>;
              })}
            </Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試前筆記區</Title>
            <Content>
              <div>想問公司的問題</div>
              {details.more_notes[0]?.question_for_company?.map((q, i) => {
                return <p key={i}>{q}</p>;
              })}
            </Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試中筆記區</Title>
            <Content>{details.more_notes[1]}</Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>面試後心得區</Title>
            <Content>{details.more_notes[2]}</Content>
          </FieldWrapper>
        </Container>
      )}
    </>
  );
};

export default NoteDetails;
