import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import firebase from '../../utils/firebase';
import useUpdateEffect from '../../hooks/useUpdateEffect';

const NoteDetails = () => {
  const [details, setDetails] = useState(null);
  let params = useParams();
  const noteId = params.noteId;

  useEffect(() => {
    firebase
      .getNoteDetails('UQjB80NDcqNauWxuSKl2y7VQg5J3', noteId)
      .then(snap => {
        snap.forEach(doc => setDetails(doc.data()));
      });
  }, []);

  useUpdateEffect(() => {
    firebase.getRecommendedUsers('company').then(snaps => {
      snaps.forEach(doc => console.log(doc.data()));
    });
  }, details);

  return (
    <>
      <h1>NoteDetails</h1>
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
