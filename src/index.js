import React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import firebase from './utils/firebase';
import Layout from './routes/Layout';
import PrivateRoute from './routes/PrivateRoute';
import Notes from './routes/notes/Notes';
import NoteDetails from './routes/notes/NoteDetails';
import NoteCreate from './routes/notes/NoteCreate';
import PracticeParent from './routes/practice/PracticeParent';
import Practice from './routes/practice/Practice';
import PracticeSetting from './routes/practice/PracticeSetting';
import PracticeStart from './routes/practice/PracticeStart';
import Profile from './routes/profile/Profile';
import Messages from './routes/Messages';
import GlobalStyle from './style/GlobalStyle';
import Loader from './components/Loader';
import Login from './routes/Login';
import NotFound from './routes/NotFound';
import NotePublic from './routes/notes/NotePublic';

import { color } from './style/variable';

const breakpoints = {
  xs: '375px',
  sm: '425px',
  md: '768px',
  lg: '1024px',
  xl: '1440px',
  '2xl': '1536px',
};

const theme = extendTheme({
  breakpoints,
  colors: {
    brand: {
      50: 'white',
      100: color.primary,
      200: '#51a386',
      300: '#6c757d',
      400: '#B7C7CE',
      500: color.primary,
      600: color.secondary,
      700: 'white',
      800: '#f3ad5f',
      900: '#f2f5f9',
    },
  },
  styles: {
    global: {
      body: {
        fontFamily: 'Noto Sans TC',
      },
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        {!isLoading && (
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route element={<PrivateRoute isLogIn={isLogIn} />}>
                <Route index element={<Navigate to="/notes" />} />
                <Route path="notes">
                  <Route index element={<Notes />} />
                  <Route path="details">
                    <Route path=":noteId" element={<NoteDetails />} />
                  </Route>
                  <Route path="create" element={<NoteCreate />} />
                </Route>

                <Route path="practice" element={<PracticeParent />}>
                  <Route index element={<Practice />} />
                  <Route path="setting">
                    <Route path=":noteId" element={<PracticeSetting />} />
                  </Route>
                  <Route path="start">
                    <Route path=":noteId" element={<PracticeStart />} />
                  </Route>
                </Route>
                <Route path="messages" element={<Messages />} />
              </Route>

              <Route path="profile">
                <Route path=":uid" element={<Profile />} />
              </Route>

              <Route path="public">
                <Route path=":uid">
                  <Route path=":noteId" element={<NotePublic />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
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
          </Routes>
        )}
      </BrowserRouter>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
