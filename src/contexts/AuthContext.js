import { createContext, useContext, useState, useEffect } from 'react';

import firebase from '../utils/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const currentUserId = firebase.auth.currentUser?.uid;
  const [isLoading, setIsLoading] = useState(true);
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    firebase.checklogin(user => {
      if (user) {
        setIsLogIn(true);
      } else {
        setIsLogIn(false);
      }
      setIsLoading(false);
    });
  }, []);

  const value = {
    currentUserId,
    isLoading,
    setIsLoading,
    isLogIn,
    setIsLogIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
