import { useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { device, color } from '../../style/variable';
import ProfileImage from '../ProfileImage';

const Container = styled.div`
  display: flex;
  border-radius: 24px;
  background: ${color.white};
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 20px;
  @media ${device.tablet} {
    align-items: center;
    flex-direction: row;
    padding: 20px 30px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  @media ${device.tablet} {
    margin-bottom: 0;
    width: 75%;
  }
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 18px;
  color: ${color.secondary};
  text-overflow: ellipsis;
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 24px;
  color: ${color.primary};
  text-overflow: ellipsis;
`;

const Status = styled.p`
  font-weight: 500;
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
          marginRight={20}
        />
        <ContentWrapper>
          <CompanyName>{note.company_name}</CompanyName>
          <JobTitle>{note.creator_info.display_name}</JobTitle>
          <Status>{note.job_title}</Status>
        </ContentWrapper>
      </MainContent>
      <Button
        size='sm'
        fontSize={['14px', null, null, '16px']}
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

Member.propTypes = {
  note: PropTypes.shape({
    creator_info: PropTypes.object,
    company_name: PropTypes.string,
    job_title: PropTypes.string,
    creator: PropTypes.string,
  }).isRequired,
};

export default Member;
