import styled from 'styled-components';
import { AiFillEye } from 'react-icons/ai';
import PropTypes from 'prop-types';

import { color } from '../style/variable';
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
    box-shadow: 0 4px 16px 0 hsl(215deg 6% 62% / 33%);
  }
`;

const Content = styled.div`
  padding: 0 16px;
`;

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid #f4f5f6;
  display: flex;
  justify-content: ${props => (props.isProfile ? 'flex-end' : 'space-between')};
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

const NoteCardExplore = ({ note, isProfile }) => {
  const goToNote = (uid, noteId) => {
    window.open(`/public/${uid}/${noteId}`, '_blank');
  };

  return (
    <NoteCard onClick={() => goToNote(note.creator, note.note_id)}>
      <Content>
        <JobTitle>{note.job_title}</JobTitle>
        <CompanyName>{note.company_name}</CompanyName>
      </Content>
      <Footer isProfile={isProfile}>
        {!isProfile && (
          <Wrapper>
            <ProfileImage
              user={note.creator_info}
              size={25}
              hasBorder={false}
              marginRight={10}
            />
            <Name>{note.creator_info.display_name}</Name>
          </Wrapper>
        )}
        <Wrapper>
          <Icon color="#9e9ea7" as={AiFillEye} boxSize="20px" mr="5px" />
          <Views>{note.views}</Views>
        </Wrapper>
      </Footer>
    </NoteCard>
  );
};

NoteCardExplore.propTypes = {
  note: PropTypes.object.isRequired,
  isProfile: PropTypes.bool,
};

export default NoteCardExplore;
