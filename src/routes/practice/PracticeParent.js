import { useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import firebase from '../../utils/firebase';

const PracticeParent = () => {
  const [databaseNotes, setDatabaseNotes] = useState([]);
  const [brief, setBrief] = useState();
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [recordType, setRecordType] = useState('錄影');
  const { currentUserId } = useOutletContext();

  useEffect(() => {
    firebase.getWholeCollection(`users/${currentUserId}/notes`).then(data => {
      setDatabaseNotes(data);
    });
  }, [currentUserId]);

  const props = {
    databaseNotes,
    setDatabaseNotes,
    practiceQuestions,
    setPracticeQuestions,
    recordType,
    setRecordType,
    brief,
    setBrief,
    currentUserId,
  };

  return <Outlet context={props} />;
};

export default PracticeParent;
