import { useEffect, useState } from 'react';
import styled from 'styled-components';

import firebase from '../../utils/firebase';

import Note from '../../components/Note';

const Practice = () => {
  const [notes, setNotes] = useState([]);
  const user = firebase.auth.currentUser;

  useEffect(() => {
    // if (!user) return;
    firebase.getNotes(user.uid).then(snaps => {
      snaps.forEach(doc => {
        setNotes(prev => [...prev, doc.data()]);
      });
    });
  }, [])

  return (
    <>
      <h1>Practice</h1>
      {notes.length !== 0 &&
        notes.map((note, i) => {
          return <Note note={note} key={i} />;
        })}
    </>
  );
};

export default Practice;
