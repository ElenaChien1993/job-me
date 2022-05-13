import styled from 'styled-components';
import { AiFillEye } from 'react-icons/ai';

import { device, color } from '../style/variable';
import ProfileImage from './ProfileImage';
import { Icon } from '@chakra-ui/react';

const NoteCard = styled.li`
  background-color: #fff;
  border-radius: 16px;
  cursor: pointer;
  min-width: 0;
  padding: 16px 0;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 4px 16px 0 hsl(215deg 6% 62% / 8%);
  }
`;

const Content = styled.div`
  padding: 0 16px;
`;

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid #f4f5f6;
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding: 16px 16px 0;
`;

const JobTitle = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
`;

const CompanyName = styled.div`
  color: #5b6067;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.div`
  color: ${color.secondary};
  font-weight: bold;
`;

const Views = styled.div`
  position: relative;
  top: -1.5px;
  color: #9e9ea7;
  font-weight: bold;
`;

const NoteCardExplore = () => {
  return (
    <NoteCard>
      <Content>
        <JobTitle>前端工程師</JobTitle>
        <CompanyName>91APP</CompanyName>
      </Content>
      <Footer>
        <Wrapper>
          <ProfileImage
            user={{ display: 'elena' }}
            size={25}
            hasBorder={false}
            marginRight={10}
          />
          <Name>Elena</Name>
        </Wrapper>
        <Wrapper>
          <Icon color="#9e9ea7" as={AiFillEye} boxSize="20px" mr="5px" />
          <Views>88</Views>
        </Wrapper>
      </Footer>
    </NoteCard>
  );
};

export default NoteCardExplore;
