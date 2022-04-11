import { SendTwoTone } from '@mui/icons-material';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  collectionGroup,
  where,
  query,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBO5LwocKFyWmosZiVyP0uCxNdNbOUYDho',
  authDomain: 'job-me-elena.firebaseapp.com',
  projectId: 'job-me-elena',
  storageBucket: 'job-me-elena.appspot.com',
  messagingSenderId: '360183641494',
  appId: '1:360183641494:web:23988dcffbf71f26afd9b7',
  measurementId: 'G-1B3CGR7QSZ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const firebase = {
  async getNotes(uid) {
    const docsSnap = await getDocs(collection(db, `users/${uid}/notes`));
    return docsSnap;
  },
  async getNoteDetails(uid, noteId) {
    const docsSnap = await getDocs(
      collection(db, `users/${uid}/notes/${noteId}/details`)
    );
    return docsSnap;
  },
  async setNote(uid, data) {
    const newDocRef = doc(collection(db, `users/${uid}/notes`));
    try {
      await setDoc(newDocRef, { ...data, note_id: newDocRef.id });
    } catch (err) {
      console.log(err);
    }
  },
  checklogin(callback) {
    onAuthStateChanged(auth, callback);
  },
  signOut() {
    return signOut(auth);
  },
  async getRecommendedUsers(company) {
    const museums = query(
      collectionGroup(db, 'notes'),
      where('company_name', '==', company),
      where('is_share', '==', true)
    );
    const querySnapshot = await getDocs(museums);
    return querySnapshot;
  },
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
};

export default firebase;
