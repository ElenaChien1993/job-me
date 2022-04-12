import { useOutletContext } from 'react-router-dom';

import Note from '../../components/Note';

const Practice = () => {
  const [notes] = useOutletContext();

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
