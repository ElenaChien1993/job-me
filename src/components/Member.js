import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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
  font-size: 16px;
  color: #999999;
`;

const Member = ({ note }) => {
  const navigate = useNavigate();
  const goToProfile = id => {
    navigate(`/profile/${id}`);
  };

  return (
    <Container>
      <ImageWrapper />
      <ContentWrapper>
        <CompanyName>{note.company_name}</CompanyName>
        <JobTitle>{note.creator_name}</JobTitle>
        <Status>{note.job_title}</Status>
      </ContentWrapper>
      <Button colorScheme="blue" onClick={() => goToProfile(note.creator)}>
        查看個人檔案
      </Button>
    </Container>
  );
};

export default Member;
