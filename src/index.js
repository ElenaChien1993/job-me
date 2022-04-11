import React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import firebase from './utils/firebase';
import Layout from './routes/Layout';
import PrivateRoute from './routes/PrivateRoute';
import Notes from './routes/notes/Notes';
import NoteDetails from './routes/notes/NoteDetails';
import NoteCreate from './routes/notes/NoteCreate';
import Practice from './routes/practice/Practice';
import PracticeSetting from './routes/practice/PracticeSetting';
import PracticeStart from './routes/practice/PracticeStart';
import Login from './routes/Login';
import Profile from './routes/profile/Profile';
import Messages from './routes/Messages';
import GlobalStyle from './components/GlobalStyle';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    firebase.checklogin((user) => {
      if (user) {
        console.log(user);
        setIsLogIn(true);
      } else {
        console.log('signed out');
        setIsLogIn(false);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <BrowserRouter>
      <GlobalStyle />
      {!isLoading && (<Routes>
        <Route path="/" element={<Layout isLogIn={isLogIn} />}>
          <Route index element={<Navigate to="/notes" />} />
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
            <Route path="setting">
              <Route path=":noteId" element={<PracticeSetting />} />
            </Route>
            <Route path="start" element={<PracticeStart />} />
          </Route>

          <Route path="profile" element={<Profile />}>
            <Route path=":uid" element={<Profile />}/>
            {/* <Route path="records" element={<Records />}/> */}
          </Route> 

          <Route path="messages" element={<Messages />} />
          {/* <Route path="*" element={<NotFound />}/> */}
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
      </Routes>)}
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
