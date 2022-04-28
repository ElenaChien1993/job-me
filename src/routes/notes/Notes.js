import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { InputGroup, InputRightElement, Input, Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import firebase from '../../utils/firebase';
import Note from '../../components/NoteCard';
import ChatCorner from '../../components/ChatCorner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 10% 0;
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

const Notes = () => {
  const [databaseNotes, setDatabaseNotes] = useState([]);
  const [renderNotes, setRenderNotes] = useState([]);
  const { currentUserId } = useOutletContext();

  useEffect(() => {
    firebase.getNotes(currentUserId).then(data => {
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

  return (
    <Container>
      <SearchBar>
        <InputGroup>
          <StyledInput
            type="text"
            placeholder="輸入公司 / 職稱 / 標籤搜尋"
            onChange={handleSearch}
          />
          <InputRightElement
            pointerEvents="none"
            children={<Search2Icon color="brand.300" />}
          />
        </InputGroup>
      </SearchBar>

      <Link to="/notes/create" style={{ alignSelf: 'flex-end' }}>
        <Button my="10px" colorScheme="brand">
          建立筆記
        </Button>
      </Link>

      <NotesWrapper>
        {databaseNotes.length !== 0 &&
          renderNotes.map(note => {
            return (
              <Note
                currentUserId={currentUserId}
                note={note}
                key={uuid()}
                databaseNotes={databaseNotes}
                setRenderNotes={setRenderNotes}
                setDatabaseNotes={setDatabaseNotes}
              />
            );
          })}
      </NotesWrapper>
      <ChatCorner />
    </Container>
  );
};

export default Notes;
