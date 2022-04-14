import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import firebase from '../../utils/firebase';

const PracticeParent = () => {
  const [databaseNotes, setDatabaseNotes] = useState([]);
  const [practiceQuestions, setPracticeQuestions] = useState([]);

  const user = firebase.auth.currentUser;
  console.log('parent');

  useEffect(() => {
    // if (!user) return;
    firebase.getNotes(user.uid).then((snaps) => {
      const notesArray = [];
      snaps.forEach((doc) => {
        notesArray.push(doc.data());
      });
      setDatabaseNotes(notesArray);
    });
  }, []);

  return (
    <Outlet
      context={{
        databaseNotes,
        setDatabaseNotes,
        practiceQuestions,
        setPracticeQuestions,
      }}
    />
  );
};

export default PracticeParent;
