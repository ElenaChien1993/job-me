import React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import firebase from './utils/firebase';
import Layout from './routes/Layout';
import Notes from './routes/Notes';
import NoteDetails from './routes/NoteDetails';
import NoteCreate from './routes/NoteCreate';
import Practice from './routes/Practice';
import PracticeSetting from './routes/PracticeSetting';
import PracticeStart from './routes/PracticeStart';
import Login from './routes/Login';

const App = () => {
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    firebase.checklogin(user => {
      if (user) {
        console.log(user);
        setIsLogIn(true);
      } else {
        console.log('signed out');
        setIsLogIn(false);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isLogIn={isLogIn} />}>
          <Route
            index
            element={
              isLogIn ? (
                <Navigate to="/notes" />
              ) : (
                <Navigate to="/login" state={{ from: '/notes' }} />
              )
            }
          />
          <Route path="notes">
            <Route
              index
              element={
                isLogIn ? (
                  <Notes />
                ) : (
                  <Navigate to="/login" state={{ from: '/notes' }} />
                )
              }
            />
            <Route path="details">
              <Route path=":noteId" element={<NoteDetails />} />
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
          <Route
            path="login"
            element={
              isLogIn ? (
                <Navigate to="/notes" />
              ) : (
                <Login setIsLogIn={setIsLogIn} />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
