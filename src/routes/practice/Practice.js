import { Search2Icon } from '@chakra-ui/icons';
import { InputGroup, InputRightElement, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';

import Note from '../../components/NoteCard';

const Background = styled.div`
  margin: 30px auto 5%;
  width: 80%;
  max-width: 1000px;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 30px;
  margin-bottom: 30px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 18px;
`;

const Practice = () => {
  const [renderNotes, setRenderNotes] = useState([]);

  const { databaseNotes } = useOutletContext();

  useEffect(() => {
    setRenderNotes(databaseNotes);
  }, [databaseNotes]);

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
    <Background>
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
      {databaseNotes.length !== 0 &&
        renderNotes.map((note, i) => {
          return <Note note={note} key={i} />;
        })}
    </Background>
  );
};

export default Practice;
