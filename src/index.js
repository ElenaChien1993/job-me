import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Layout from './routes/Layout';
import Notes from './routes/Notes';
import NoteDetails from './routes/NoteDetails';
import NoteCreate from './routes/NoteCreate';
import Practice from './routes/Practice';
import PracticeSetting from './routes/PracticeSetting';
import PracticeStart from './routes/PracticeStart';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/notes" />} />
          <Route path="notes">
            <Route index element={<Notes />} />
            <Route path="details">
              <Route path=":noteId" element={<NoteDetails />}/>
            </Route>
            <Route path="create" element={<NoteCreate />} />
          </Route>

          <Route path="practice">
            <Route index element={<Practice />} />
            <Route path="setting" element={<PracticeSetting />} />
            <Route path="start" element={<PracticeStart />} />
          </Route>

          {/* <Route path="profile" element={<Profile />}>
            <Route path=":uid" element={<Profile />}/>
            <Route path="records" element={<Records />}/>
          </Route> 

          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<NotFound />}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
