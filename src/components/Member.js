import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from './ProfileImage';

const Container = styled.div`
  display: flex;
  align-items: center;
  border-radius: 24px;
  background: white;
  padding: 20px 40px;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 112px;
  justify-content: space-between;
  white-space: nowrap;
  overflow: hidden;
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
  text-overflow: ellipsis;
`;

const Status = styled.p`
  font-weight: 700;
  font-size: 18px;
  color: #999999;
`;

const Member = ({ note }) => {
  const navigate = useNavigate();
  const goToProfile = id => {
    navigate(`/profile/${id}`);
  };

  return (
    <Container>
      <ProfileImage
        user={note.creator_info}
        size={100}
        hasBorder={false}
        marginRight={30}
      />
      <ContentWrapper>
        <CompanyName>{note.company_name}</CompanyName>
        <JobTitle>{note.creator_info.display_name}</JobTitle>
        <Status>{note.job_title}</Status>
      </ContentWrapper>
      <Button variant="outline" ml="auto" colorScheme="brand" onClick={() => goToProfile(note.creator)}>
        查看個人檔案
      </Button>
    </Container>
  );
};

export default Member;
