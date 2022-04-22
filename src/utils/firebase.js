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
  limit,
  addDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { formatDistance, formatRelative } from 'date-fns';
import { zhTW } from 'date-fns/locale';

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
  async getUser(uid) {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        return docSnap;
      } else {
        console.log('No such document!');
      }
    } catch (err) {
      console.log(err);
    }
  },
  async updateUserInfo(uid, data) {
    try {
      await updateDoc(doc(db, 'users', uid), data);
      this.updateUser(data.display_name);
    } catch (err) {
      console.log(err);
    }
  },
  listenUserProfileChange(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), async doc => {
      callback(prev => {
        return { ...prev, ...doc.data() };
      });
    });
  },
  listenUserRecordsChange(uid, setAudioRecords ,setVideoRecords) {
    return onSnapshot(collection(db, 'users', uid, 'records'), async docs => {
      let data = [];
      docs.forEach(doc => {
        data.push(doc.data());
      });
      const transformed = data.map(record => {
        const timeString = `${record.date.toDate().toLocaleDateString(undefined, {
          month: 'numeric',
          day: 'numeric',
        })} ${record.date.toDate().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}`;
        return { ...record, date: timeString };
      });
      const audios = transformed.filter(record => record.type === 0);
      const videos = transformed.filter(record => record.type === 1);
      setAudioRecords(audios);
      setVideoRecords(videos);
    });
  },
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
    try {
      await setDoc(newDocRef, { ...data, record_id: newDocRef.id });
      return newDocRef.id;
    } catch (err) {
      console.log(err);
    }
  },
  async updateRecord(uid, recordId, data) {
    const newDocRef = doc(db, `users/${uid}/records/${recordId}`);
    try {
      await updateDoc(newDocRef, data);
    } catch (err) {
      console.log(err);
    }
  },
  async deleteRecord(uid, recordId) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'records', recordId));
    } catch (err) {
      console.log(err);
    }
  },
  listenDetailsChange(noteId, callback) {
    return onSnapshot(doc(db, 'details', noteId), callback);
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
  async uploadFile(path, file) {
    const fileRef = ref(storage, path);
    return uploadBytes(fileRef, file).then(() => {
      console.log('Uploaded a blob or file!');
    });
  },
  async deleteFile(path) {
    const fileRef = ref(storage, path);
    deleteObject(fileRef)
      .then(() => {
        alert('已刪除檔案');
      })
      .catch(error => {
        console.log(error);
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
      orderBy('latest_timestamp', 'desc'),
      limit(7)
    );
    const querySnapshot = await getDocs(rooms);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    const transformedRooms = await Promise.all(
      data.map(async room => {
        const timeRelative = formatRelative(
          new Date(room.latest_timestamp.seconds * 1000),
          new Date(),
          { locale: zhTW, addSuffix: true }
        );
        const friendId = room.members.filter(id => id !== uid);
        const userData = await this.getUserName(friendId[0]);
        return { ...room, members: userData, latest_timestamp: timeRelative };
      })
    );
    return transformedRooms;
  },
  async setChatroom(data) {
    const newDocRef = doc(collection(db, 'chatrooms'));
    try {
      await setDoc(newDocRef, { ...data, id: newDocRef.id });
      return newDocRef.id;
    } catch (err) {
      console.log(err);
    }
  },
  async getUserName(uid) {
    const docSnap = await getDoc(doc(db, 'users', uid));
    const name = docSnap.data().display_name;
    const photo = docSnap.data().photo_url ? docSnap.data().photo_url : '';
    return { name, photo_url: photo };
  },
  listenRoomsChange(uid, callback) {
    const q = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', uid)
    );
    return onSnapshot(q, async snapshot => {
      let data;
      snapshot.docChanges().forEach(change => {
        if (change.type === 'modified') {
          data = change.doc.data();
        }
      });
      if (!data) return;
      const timeRelative = formatRelative(
        new Date(data.latest_timestamp.seconds * 1000),
        new Date(),
        { locale: zhTW, addSuffix: true }
      );
      const friendId = data.members.filter(id => id !== uid);
      const name = await this.getUserName(friendId[0]);
      data = { ...data, latest_timestamp: timeRelative, members: name };
      callback(prev => {
        const filtered = prev.filter(room => room.id !== data.id);
        return [data, ...filtered];
      });
    });
  },
  async getMoreMessages(roomId, message) {
    if (!message) return;
    const docsSnap = await getDocs(
      query(
        collection(db, `chatrooms/${roomId}/messages`),
        where('create_at', '<', message.create_at),
        orderBy('create_at', 'desc'),
        limit(20)
      )
    );
    let data = [];
    docsSnap.forEach(doc => {
      data.push(doc.data());
    });
    data.sort((a, b) => !b.create_at - a.create_at);
    return data;
  },
  async getMessages(roomId) {
    const docsSnap = await getDocs(
      query(
        collection(db, `chatrooms/${roomId}/messages`),
        orderBy('create_at', 'desc'),
        limit(20)
      )
    );
    let data = [];
    docsSnap.forEach(doc => {
      data.push(doc.data());
    });
    data.sort((a, b) => !b.create_at - a.create_at);
    return data;
  },
  async listenMessagesChange(room, callback, uid) {
    const q = query(
      collection(db, 'chatrooms', room.id, 'messages'),
      orderBy('create_at', 'desc'),
      limit(20)
    );
    return onSnapshot(
      q,
      async snapshot => {
        let data = [];
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            data.push(change.doc.data());
          }
        });
        data.sort((a, b) => !b.create_at - a.create_at);
        console.log('data', data);
        callback(prev => {
          if (!prev[room.id]) {
            return {
              ...prev,
              [room.id]: data,
            };
          } else {
            return { ...prev, [room.id]: [...prev[room.id], ...data] };
          }
        });
        if (!room.id || uid === room.latest_sender) return;
        this.updateRoom(room.id, { receiver_has_read: true });
      },
      error => {
        console.error(error);
      }
    );
  },
  async sendMessage(roomId, data) {
    try {
      await addDoc(collection(db, 'chatrooms', roomId, 'messages'), data);
      await updateDoc(doc(db, 'chatrooms', roomId), {
        latest_timestamp: data.create_at,
        latest_message: data.text,
        receiver_has_read: false,
        latest_sender: data.uid,
      });
    } catch (err) {
      console.log(err);
    }
  },
  async updateRoom(roomId, data) {
    try {
      await updateDoc(doc(db, 'chatrooms', roomId), data);
    } catch (err) {
      console.log(err);
    }
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
