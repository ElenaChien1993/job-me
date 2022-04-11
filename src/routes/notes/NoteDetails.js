import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import NoteElement from '../../components/NoteElement';
import firebase from '../../utils/firebase';
import useUpdateEffect from '../../hooks/useUpdateEffect';

const NoteDetails = () => {
  const [brief, setBrief] = useState(null);
  const [details, setDetails] = useState(null);
  let params = useParams();
  const noteId = params.noteId;
  const user = firebase.auth.currentUser;

  useEffect(() => {
    firebase.getNote(user.uid, noteId).then((snap) => {
      setBrief(snap.data());
    });
    firebase.getNoteDetails(noteId).then((snap) => {
      setDetails(snap.data());
    });
  }, []);

  useUpdateEffect(() => {
    firebase.getRecommendedUsers('company').then((snaps) => {
      snaps.forEach((doc) => console.log(doc.data()));
    });
  }, details);

  return (
    <>
      {brief && <NoteElement note={brief} />}
      {details && (
        <ul>
          <li>產品：{details.product}</li>
          <li>薪資：{`${details.salary.range} K / ${details.salary.type}`}</li>
        </ul>
      )}
    </>
  );
};

export default NoteDetails;
