import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../style/device';
import ProfileImage from './ProfileImage';

const Container = styled.div`
  display: flex;
  border-radius: 24px;
  background: white;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  @media ${device.mobileM} {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 30px;
  }
  @media ${device.tablet} {
    align-items: center;
    flex-direction: row;
    padding: 20px 40px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 112px;
  justify-content: space-between;
  white-space: nowrap;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  @media ${device.mobileM} {
    margin-bottom: 10px;
  }
  @media ${device.tablet} {
    margin-bottom: 0;
  }
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
      <MainContent>
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
      </MainContent>
      <Button
        size={['sm', null, null, 'md']}
        fontSize={['14px', null, null, '18px']}
        p={['5px', null, null, '10px']}
        variant="outline"
        ml="auto"
        colorScheme="brand"
        onClick={() => goToProfile(note.creator)}
      >
        查看個人檔案
      </Button>
    </Container>
  );
};

export default Member;
