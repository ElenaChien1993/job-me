import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";

import firebase from '../utils/firebase';
import Note from '../components/Note';

const Notes = () => {
  const [notes] = useOutletContext();

  return (
    <>
      <h1>Notes</h1>
      {notes.length !==0  && notes.map((note, i) => {
        return <Note note={note} key={i}/>
      })}
    </>
  );
};

export default Notes;
