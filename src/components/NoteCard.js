import { Link, useLocation } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';
import NoteElement from './NoteCardEditable';

const Container = styled.div`
  position: relative;
`;

const DeleteButton = styled(IconButton)`
  && {
    position: absolute;
    top: 75px;
    right: 50px;
    cursor: pointer;
  }
`;

const StyledNote = styled(NoteElement)`
  cursor: pointer;
`;

const Note = ({ note, databaseNotes, setRenderNotes, setDatabaseNotes }) => {
  const { pathname } = useLocation();
  const user = firebase.auth.currentUser;

  const handleDeleteNote = () => {
    firebase.deleteNote(user.uid, note.note_id);
    const update = databaseNotes.filter(
      (item) => item.note_id !== note.note_id
    );
    setDatabaseNotes(update);
    setRenderNotes(update);
  };

  return (
    <Container>
      <Link
        to={
          pathname === '/notes'
            ? `/notes/details/${note.note_id}`
            : `/practice/setting/${note.note_id}`
        }
      >
        <StyledNote note={note} editable={false} />
      </Link>
      {pathname === '/notes' && (
        <DeleteButton
          onClick={handleDeleteNote}
          aria-label="Delete note"
          icon={<DeleteIcon />}
        />
      )}
    </Container>
  );
};

export default Note;
