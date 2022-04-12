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
import { SmallCloseIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import NoteElement from '../../components/NoteElement';
import firebase from '../../utils/firebase';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import AddField from '../../components/AddField';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: white;
  padding: 20px 40px 0;
  margin-bottom: 60px;
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

const DeleteButton = styled(IconButton)`
  && {
    display: none;
  }
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

  let params = useParams();
  const noteId = params.noteId;
  const user = firebase.auth.currentUser;

  useEffect(() => {
    firebase.getNote(user.uid, noteId).then(snap => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then(snap => {
      setDetails(snap.data());
    });
    firebase.listenDetailsChange(noteId)

  }, []);

  useUpdateEffect(() => {
    // firebase.getRecommendedUsers('company').then(snaps => {
    //   snaps.forEach(doc => console.log(doc.data()));
    // });
  }, details);

  const handleRequirementsChange = (item, itemIndex) => {
    const updatedChecked = details.requirements.map((item, index) =>
      index === itemIndex
        ? {
            ...item,
            is_qualified: !item.is_qualified,
          }
        : item
    );

    setDetails(prev => {
      return { ...prev, requirements: updatedChecked };
    });
  };

  const handleBonusChange = (item, itemIndex) => {
    const updatedChecked = details.bonus.map((item, index) =>
      index === itemIndex
        ? {
            ...item,
            is_qualified: !item.is_qualified,
          }
        : item
    );

    setDetails(prev => {
      return { ...prev, bonus: updatedChecked };
    });
  };

  const editNoteDetails = (e, key) => {
    if (e.target.value === details[key]) return;
    firebase.updateNoteDetails(noteId, key, e.target.value);
  };

  const handleSalaryChange = (e, key) => {
    const updated = { ...details.salary, [key]: e.target.value };
    firebase.updateNoteDetails(noteId, 'salary', updated);
  };

  const handleResponsibilitiesInputChange = (e, index) => {
    const update = details.responsibilities.map((item, i) =>
      i === index ? e.target.value : item
    );
    if (JSON.stringify(update) === JSON.stringify(details.responsibilities))
      return;
    firebase.updateNoteDetails(noteId, 'responsibilities', update);
  };

  const handleDelete = (i, objectKey) => {
    console.log(i);
    const newData = details[objectKey].filter((_, index) => index !== i);
    console.log(newData);
    firebase.updateNoteDetails(noteId, objectKey, newData);
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
            <Editable defaultValue={details.product}>
              <EditablePreview />
              <EditableInput onBlur={e => editNoteDetails(e, 'product')} />
            </Editable>
          </FieldWrapper>
          <FieldWrapper>
            <Title>薪資範圍</Title>
            <StyledSalaryWrapper>
              <StyledEditable defaultValue={details.salary.range}>
                <EditablePreview />
                <EditableInput onBlur={e => handleSalaryChange(e, 'range')} />
              </StyledEditable>
              <Content> K </Content>
              <Select
                variant="outline"
                isFullWidth={false}
                maxWidth="100px"
                // placeholder={details.salary.type}
                onBlur={e => handleSalaryChange(e, 'type')}
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
                  <Editable defaultValue={item} key={i}>
                    <StyledListItem>
                      <EditablePreview />
                      <EditableInput
                        onBlur={e => handleResponsibilitiesInputChange(e, i)}
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
              newValue={'新欄位'}
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
                    onChange={() => handleRequirementsChange(item, i)}
                  />
                  <p>{item.description}</p>
                </CheckBoxWrapper>
              );
            })}
          </FieldWrapper>
          <FieldWrapper>
            <Title>加分項目</Title>
            {details.bonus.map((item, i) => {
              return (
                <CheckBoxWrapper key={i}>
                  <CheckBox
                    type="checkbox"
                    checked={details.bonus[i].is_qualified}
                    onChange={() => handleBonusChange(item, i)}
                  />
                  <p>{item.description}</p>
                </CheckBoxWrapper>
              );
            })}
          </FieldWrapper>
          <FieldWrapper>
            <Title>相關準備資料連結</Title>
            <Content>
              <StyledListItem>
                <StyledLink href={details.job_link}>職缺連結</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <StyledLink href={details.resume_link}>我的履歷連結</StyledLink>
              </StyledListItem>
              {details.attached_files.map((file, i) => {
                return (
                  <StyledListItem key={i}>
                    <StyledLink href={file.file_link}>
                      {file.file_name}
                    </StyledLink>
                  </StyledListItem>
                );
              })}
            </Content>
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
