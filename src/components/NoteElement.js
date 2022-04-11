import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 182px;
  border-radius: 24px;
  background: white;
  padding: 0 40px;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background: #f5cdc5;
  margin-right: 30px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 112px;
  justify-content: space-between;
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: #306172;
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: black;
`;

const Status = styled.p`
  font-weight: 700;
  font-size: 20px;
  color: #999999;
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

const Tag = styled.div`
  padding: 13px 24px;
  height: 40px;
  background: #d5f4f7;
  border-radius: 6px;
  color: #306172;
  font-weight: 700;
  font-size: 16px;
  margin-right: 14px;
`;

const NoteElement = ({ note }) => {
  console.log('NoteEl render');
  
  return (
    <Container>
      <ImageWrapper />
      <ContentWrapper>
        <CompanyName>{note.company_name}</CompanyName>
        <JobTitle>{note.job_title}</JobTitle>
        <Status>{`${note.status}｜${note.address}`}</Status>
      </ContentWrapper>
      <TagsWrapper>
        {note.tags && note.tags.map((tag, i) => {
          return <Tag key={i}>{tag}</Tag>;
        })}
      </TagsWrapper>
    </Container>
  );
};

export default NoteElement;
