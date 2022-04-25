import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import firebase from '../../utils/firebase';

const PracticeParent = () => {
  const [databaseNotes, setDatabaseNotes] = useState([]);
  const [brief, setBrief] = useState();
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [recordType, setRecordType] = useState('錄影');

  const user = firebase.auth.currentUser;

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

  const props = {
    databaseNotes,
    setDatabaseNotes,
    practiceQuestions,
    setPracticeQuestions,
    recordType,
    setRecordType,
    brief,
    setBrief,
    user,
  };

  return <Outlet context={props} />;
};

export default PracticeParent;
