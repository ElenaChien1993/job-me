import { Link, useLocation } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';
import NoteElement from './NoteCardEditable';
import { device } from '../style/variable';

const Container = styled.div`
  position: relative;
`;

const DeleteButton = styled(IconButton)`
  && {
    position: absolute;
    top: 12px;
    right: 20px;
    cursor: pointer;
  }
`;

const StyledNote = styled(NoteElement)`
  cursor: pointer;
`;

const Note = ({
  note,
  currentUserId,
  databaseNotes,
  setRenderNotes,
  setDatabaseNotes,
}) => {
  const { pathname } = useLocation();

  const handleDeleteNote = () => {
    firebase.deleteNote(currentUserId, note.note_id).then(() => {
      const update = databaseNotes.filter(
        item => item.note_id !== note.note_id
      );
      setDatabaseNotes(update);
      setRenderNotes(update);
    });
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
          variant="ghost"
          onClick={handleDeleteNote}
          aria-label="Delete note"
          icon={<DeleteIcon />}
        />
      )}
    </Container>
  );
};

export default Note;
