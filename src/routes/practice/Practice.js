import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';

import Note from '../../components/NoteCard';

const Background = styled.div`
  margin: 0 10%;
  padding-top: 90px;
`

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
  const [renderNotes, setRenderNotes] = useState([]);

  const {databaseNotes} = useOutletContext();

  useEffect(() => {
    setRenderNotes(databaseNotes);
  }, [databaseNotes]);

  console.log(databaseNotes)

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
    <Background>
      <SearchBar>
        <Input type="text" onChange={handleSearch} />
      </SearchBar>
      {databaseNotes.length !== 0 &&
        renderNotes.map((note, i) => {
          return <Note note={note} key={i} />;
        })}
    </Background>
  );
};

export default Practice;
