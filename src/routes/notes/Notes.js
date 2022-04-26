import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import firebase from '../../utils/firebase';
import Note from '../../components/NoteCard';
import ChatCorner from '../../components/ChatCorner';
import { initMap } from '../../components/GoogleSearch';

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

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 18px;
`;

const CreateButton = styled.button`
  width: 115px;
  height: 35px;
  background: #306172;
  border-radius: 24px;
  padding: 9px 24px;
  color: white;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const NotesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 115px;
  align-self: flex-end;
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
    const filtered = databaseNotes.filter(
      note => note.company_name.includes(term) || note.job_title.includes(term)
    );
    setRenderNotes(filtered);
  };

  return (
    <Container>
      <SearchBar>
        <Input type="text" onChange={handleSearch} />
      </SearchBar>
      <ButtonWrapper>
        <Link to="/notes/create">
          <CreateButton>建立筆記</CreateButton>
        </Link>
      </ButtonWrapper>
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
