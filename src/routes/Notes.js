import { useEffect, useState } from 'react';

import firebase from '../utils/firebase';
import Note from '../components/Note';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    firebase.getNotes('UQjB80NDcqNauWxuSKl2y7VQg5J3').then(snaps => {
      snaps.forEach(doc => {
        console.log(doc.data());
        setNotes(prev => [...prev, doc.data()]);
      });
    });
  }, []);

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
