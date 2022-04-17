import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
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
  onSnapshot,
  deleteDoc,
  Timestamp,
  orderBy,
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
  async getNote(uid, docId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid, 'notes', docId));
      if (docSnap.exists()) {
        return docSnap;
      } else {
        console.log('No such document!');
      }
    } catch (err) {
      console.log(err);
    }
  },
  async setNoteBrief(uid, data) {
    const newDocRef = doc(collection(db, `users/${uid}/notes`));
    try {
      await setDoc(newDocRef, { ...data, note_id: newDocRef.id });
      return newDocRef.id;
    } catch (err) {
      console.log(err);
    }
  },
  async updateNoteBrief(uid, noteId, data) {
    try {
      await updateDoc(doc(db, 'users', uid, 'notes', noteId), data);
    } catch (err) {
      console.log(err);
    }
  },
  async deleteNote(uid, noteId) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'notes', noteId));
    } catch (err) {
      console.log(err);
    }
  },
  async getNotes(uid) {
    const docsSnap = await getDocs(collection(db, `users/${uid}/notes`));
    return docsSnap;
  },
  async getNoteDetails(noteId) {
    const docSnap = await getDoc(doc(db, 'details', noteId));
    return docSnap;
  },
  async setNoteDetails(noteId, data) {
    try {
      await setDoc(doc(db, 'details', noteId), data);
    } catch (err) {
      console.log(err);
    }
  },
  async updateNoteDetails(noteId, data) {
    try {
      await updateDoc(doc(db, 'details', noteId), data);
    } catch (err) {
      console.log(err);
    }
  },
  async setRecord(uid, data) {
    const newDocRef = doc(collection(db, `users/${uid}/records`));
    console.log('in setRecord!');
    try {
      await setDoc(newDocRef, { ...data, record_id: newDocRef.id });
      // return newDocRef.id;
    } catch (err) {
      console.log(err);
    }
  },
  listenDetailsChange(noteId, callback) {
    onSnapshot(doc(db, 'details', noteId), callback);
  },
  checklogin(callback) {
    onAuthStateChanged(auth, callback);
  },
  async signUp(uid, email) {
    try {
      await setDoc(doc(db, 'users', uid), { display_name: email });
    } catch (err) {
      console.log(err);
    }
  },
  signOut() {
    return signOut(auth);
  },
  updateUser(name) {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('updated');
      })
      .catch(error => {
        console.log(error);
      });
  },
  async getRecommendedUsers(company, uid) {
    const members = query(
      collectionGroup(db, 'notes'),
      where('company_name', '==', company),
      where('is_share', '==', true)
    );
    const querySnapshot = await getDocs(members);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    const filteredData = data.filter(item => item.creator !== uid);
    return filteredData;
  },
  async uplaodFile(path, file) {
    const fileRef = ref(storage, path);
    return uploadBytes(fileRef, file).then(() => {
      console.log('Uploaded a blob or file!');
    });
  },
  async getDownloadURL(path) {
    return getDownloadURL(ref(storage, path))
      .then(url => {
        return url;
      })
      .catch(error => {
        console.log(error);
      });
  },
  async getChatrooms(uid) {
    const rooms = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', uid),
      orderBy('latest_timestamp', 'desc')
    );
    const querySnapshot = await getDocs(rooms);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  },
  async getUserName(uid) {
    const docSnap = await getDoc(doc(db, 'users', uid));
    const name = docSnap.data().display_name;
    return name;
  },
  async getMessages(roomId) {
    const docsSnap = await getDocs(query(
      collection(db, `chatrooms/${roomId}/messages`),
      orderBy('create_at')
    ));
    let data = [];
    docsSnap.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  },
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
  onSnapshot,
  Timestamp,
};

export default firebase;
