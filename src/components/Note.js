import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import NoteElement from "./NoteElement";

const StyledNote = styled(NoteElement)`
  cursor: pointer;
`

const Note = ({ note }) => {
  const { pathname } = useLocation();

  return (
    <Link
      to={
        pathname === '/notes'
          ? `/notes/details/${note.note_id}`
          : `/practice/setting/${note.note_id}`
      }
    >
      <StyledNote note={note} editable={false}/>
    </Link>
  );
};

export default Note;
