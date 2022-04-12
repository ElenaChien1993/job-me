import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import Note from '../../components/Note';

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
  const [notes] = useOutletContext();

  return (
    <Container>
      <SearchBar>
        <Input type="text" />
      </SearchBar>
      <ButtonWrapper>
        <Link to="/notes/create">
          <CreateButton>建立筆記</CreateButton>
        </Link>
      </ButtonWrapper>
      <NotesWrapper>
        {notes.length !== 0 &&
          notes.map((note, i) => {
            return <Note note={note} key={i} />;
          })}
      </NotesWrapper>
    </Container>
  );
};

export default Notes;
