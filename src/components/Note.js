import { Link, useLocation } from 'react-router-dom';

import NoteElement from "./NoteElement";

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
      <NoteElement note={note}/>
    </Link>
  );
};

export default Note;
