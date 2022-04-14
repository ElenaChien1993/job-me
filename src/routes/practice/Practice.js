import { useEffect, useState } from 'react';
import styled from 'styled-components';

import firebase from '../../utils/firebase';

import Note from '../../components/Note';

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

const Practice = () => {
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
    <>
      <SearchBar>
        <Input type="text" onChange={handleSearch} />
      </SearchBar>
      {databaseNotes.length !== 0 &&
        renderNotes.map((note, i) => {
          return <Note note={note} key={i} />;
        })}
    </>
  );
};

export default Practice;
