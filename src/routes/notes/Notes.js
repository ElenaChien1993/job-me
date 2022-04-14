import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import Note from '../../components/NoteCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  const user = firebase.auth.currentUser;

  useEffect(() => {
    // if (!user) return;
    firebase.getNotes(user.uid).then((snaps) => {
      const notesArray = [];
      snaps.forEach((doc) => {
        notesArray.push(doc.data());
      });
      setDatabaseNotes(notesArray);
      setRenderNotes(notesArray);
    });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    if (!term) {
      setRenderNotes(databaseNotes);
      return;
    }
    const filtered = databaseNotes.filter(
      (note) =>
        note.company_name.includes(term) || note.job_title.includes(term)
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
          renderNotes.map((note, i) => {
            return (
              <Note
                note={note}
                key={i}
                databaseNotes={databaseNotes}
                setRenderNotes={setRenderNotes}
                setDatabaseNotes={setDatabaseNotes}
              />
            );
          })}
      </NotesWrapper>
    </Container>
  );
};

export default Notes;
