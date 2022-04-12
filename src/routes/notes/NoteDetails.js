import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import NoteElement from '../../components/NoteElement';
import firebase from '../../utils/firebase';
import useUpdateEffect from '../../hooks/useUpdateEffect';

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

const StyledListItem = styled.li`
  margin-bottom: 10px;
`;

const NoteDetails = () => {
  const [brief, setBrief] = useState();
  const [details, setDetails] = useState();
  const [requirementsChecked, setRequirementsChecked] = useState([]);
  const [bonusChecked, setBonusChecked] = useState([]);
  let params = useParams();
  const noteId = params.noteId;
  const user = firebase.auth.currentUser;

  useEffect(() => {
    firebase.getNote(user.uid, noteId).then(snap => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then(snap => {
      console.log(snap.data());
      setDetails(snap.data());
    });
  }, []);

  useUpdateEffect(() => {
    // firebase.getRecommendedUsers('company').then(snaps => {
    //   snaps.forEach(doc => console.log(doc.data()));
    // });

    const checked = details.requirements.map(item => item.is_qualified);
    setRequirementsChecked(checked);

    const checkedBonus = details.bonus.map(item => item.is_qualified);
    setBonusChecked(checkedBonus);
  }, details);

  const handleRequirementsChange = (item, itemIndex) => {
    const updatedChecked = requirementsChecked.map((item, index) =>
      index === itemIndex ? !item : item
    );

    setRequirementsChecked(updatedChecked);
  };

  const handleBonusChange = (item, itemIndex) => {
    const updatedChecked = bonusChecked.map((item, index) =>
      index === itemIndex ? !item : item
    );

    setBonusChecked(updatedChecked);
  };

  return (
    <>
      {brief && <NoteElement note={brief} />}
      {details && (
        <Container>
          <SectionTitle>詳細資料</SectionTitle>
          <FieldWrapper>
            <Title>公司主要產品 / 服務</Title>
            <Content>{details.product}</Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>薪資範圍</Title>
            <Content>{`${details.salary.range} K / ${details.salary.type}`}</Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>工作內容</Title>
            <Content>
              {details.responsibilities.map((item, i) => {
                return <StyledListItem key={i}>{item}</StyledListItem>;
              })}
            </Content>
          </FieldWrapper>
          <FieldWrapper>
            <Title>必備技能</Title>
            {details.requirements.map((item, i) => {
              return (
                <CheckBoxWrapper key={i}>
                  <CheckBox
                    type="checkbox"
                    checked={requirementsChecked[i]}
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
                    checked={bonusChecked[i]}
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
