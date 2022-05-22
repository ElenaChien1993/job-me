import { Link, useLocation } from 'react-router-dom';

import { IconButton, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import NoteElement from './NoteCardEditable';
import AlertModal from '../AlertModal';

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
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });
  const { pathname } = useLocation();

  const handleDeleteNote = async () => {
    await firebase.deleteData(`users/${currentUserId}/notes/${note.note_id}`);
    await firebase.updateUserInfo(currentUserId, {
      notes_qty: firebase.increment(-1),
    });
    const update = databaseNotes.filter(item => item.note_id !== note.note_id);
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
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        header="刪除筆記"
        content="筆記一經刪除便無法復原，確定刪除嗎？"
        actionText="刪除"
        action={handleDeleteNote}
      />
      {pathname === '/notes' && (
        <DeleteButton
          variant="ghost"
          onClick={onOpen}
          aria-label="Delete note"
          icon={<DeleteIcon />}
        />
      )}
    </Container>
  );
};

export default Note;
