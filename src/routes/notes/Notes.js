import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { InputGroup, InputRightElement, Input, Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import Note from '../../components/notes/NoteCard';
import ChatCorner from '../../components/messages/ChatCorner';
import { color, device } from '../../style/variable';
import Loader from '../../components/Loader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto 0;
  width: 80%;
  max-width: 1000px;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 30px;
  margin-bottom: 16px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 18px;
`;

const NotesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoNote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: #999;
  @media ${device.mobileM} {
    font-size: 15px;
  }
  @media ${device.tablet} {
    font-size: 18px;
  }
  & span {
    color: ${color.secondary};
    font-weight: bold;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Notes = () => {
  const [databaseNotes, setDatabaseNotes] = useState(null);
  const [renderNotes, setRenderNotes] = useState([]);
  const { currentUserId } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;
    firebase.getWholeCollection(`users/${currentUserId}/notes`).then(data => {
      setDatabaseNotes(data);
      setRenderNotes(data);
    });
  }, [currentUserId]);

  const handleSearch = e => {
    const term = e.target.value;
    if (!term) {
      setRenderNotes(databaseNotes);
      return;
    }
    const filtered = databaseNotes.filter(note => {
      const regex = new RegExp(term, 'gi');
      return (
        note.company_name.match(regex) ||
        note.job_title.match(regex) ||
        note.tags.join().match(regex)
      );
    });
    setRenderNotes(filtered);
  };

  if (!databaseNotes) return <Loader />;

  return (
    <Container>
      <SearchBar>
        <InputGroup>
          <StyledInput
            type="text"
            placeholder="???????????? / ?????? / ????????????"
            onChange={handleSearch}
            bg="white"
          />
          <InputRightElement
            zIndex={0}
            pointerEvents="none"
            children={<Search2Icon color="brand.300" />}
          />
        </InputGroup>
      </SearchBar>

      <Link to="/notes/create" style={{ alignSelf: 'flex-end' }}>
        <Button
          _hover={{
            background: 'none',
            color: color.primary,
            border: `1px solid ${color.primary}`,
          }}
          h="2rem"
          fontSize="14px"
          my="10px"
          colorScheme="brand"
        >
          ????????????
        </Button>
      </Link>

      <NotesWrapper>
        {databaseNotes.length !== 0 ? (
          renderNotes.map(note => {
            return (
              <Note
                currentUserId={currentUserId}
                note={note}
                key={note.note_id}
                databaseNotes={databaseNotes}
                setRenderNotes={setRenderNotes}
                setDatabaseNotes={setDatabaseNotes}
              />
            );
          })
        ) : (
          <NoNote>
            <p>????????????????????????????????????????????????????????????</p>
            <p>
              ????????????<span onClick={() => navigate('/explore')}>??????</span>
              ?????????????????????????????????
            </p>
          </NoNote>
        )}
      </NotesWrapper>
      <ChatCorner />
    </Container>
  );
};

export default Notes;
