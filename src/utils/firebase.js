import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
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
  increment,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import helper from './helper';
import useFormatedTime from '../hooks/useFormatedTime';
import useRelativeTime from '../hooks/useRelativeTime';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'job-me-elena.firebaseapp.com',
  projectId: 'job-me-elena',
  storageBucket: 'job-me-elena.appspot.com',
  messagingSenderId: '360183641494',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: 'G-1B3CGR7QSZ',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

const changeReadStatus = async (roomId, uid) => {
  const roomSnap = await getDoc(doc(db, 'chatrooms', roomId));
  const lastSender = roomSnap.data().latest_sender;
  if (uid === lastSender) return;
  firebase.updateRoom(roomId, { receiver_has_read: true, unread_qty: 0 });
};

const changeTimeIntoMillis = (data, key) => {
  const millisData = data.map(item => {
    return { ...item, [key]: item[key].toMillis() };
  });
  return millisData;
};

const getCompleteRoomsData = async (rooms, uid) => {
  const newRooms = await Promise.all(
    rooms.map(async room => {
      const timeRelative = useRelativeTime(room);
      const friendId = room.members.filter(id => id !== uid);
      const userData = await firebase.getUserInfo(...friendId);
      return {
        ...room,
        members: userData,
        latest: { ...room.latest, timestamp: timeRelative },
      };
    })
  );

  return newRooms;
};

const getUniqueMatchedData = async (key, value, uid) => {
  const matchedMembers = query(
    collectionGroup(db, 'notes'),
    where(key, '==', value),
    where('is_share', '==', true),
    where('creator', '!=', uid),
    limit(15)
  );
  const querySnapshot = await getDocs(matchedMembers);
  let data = [];
  querySnapshot.forEach(doc => {
    data.push(doc.data());
  });
  const uniqueMembers = helper.fillterItemWithDuplicateCreator(data);
  return uniqueMembers;
};

const firebase = {
  async getUser(uid) {
    if (!uid) return;
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap;
    } else {
      throw new Error('查無此用戶');
    }
  },
  async getUserInfo(uid) {
    const docSnap = await this.getUser(uid);
    const name = docSnap?.data().display_name || '未提供';
    const photo = docSnap?.data().photo_url || '';
    return { display_name: name, photo_url: photo };
  },
  async getNote(uid, docId) {
    const docSnap = await getDoc(doc(db, 'users', uid, 'notes', docId));
    if (docSnap.exists()) {
      return docSnap;
    } else {
      throw new Error('查無此筆記記錄');
    }
  },
  async getNoteDetails(noteId) {
    const docSnap = await getDoc(doc(db, 'details', noteId));
    return docSnap;
  },
  async getWholeCollection(path) {
    const docsSnap = await getDocs(collection(db, path));
    const data = [];
    docsSnap.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  },
  async getPublicNotes() {
    const publicNotes = query(
      collectionGroup(db, 'notes'),
      where('is_share', '==', true),
      orderBy('views', 'desc')
    );
    const querySnapshot = await getDocs(publicNotes);
    let notes = [];
    querySnapshot.forEach(doc => {
      notes.push(doc.data());
    });

    const users = await Promise.all(
      notes.map(async note => {
        const userData = await this.getUserInfo(note.creator);
        return { ...note, creator_info: userData };
      })
    );
    return users;
  },
  async getPersonalPublicNotes(uid) {
    const q = query(
      collection(db, 'users', uid, 'notes'),
      where('is_share', '==', true),
      orderBy('views', 'desc')
    );
    const querySnapshot = await getDocs(q);
    let notes = [];
    querySnapshot.forEach(doc => {
      notes.push(doc.data());
    });
    return notes;
  },
  async getRecommendedUsers(company, job, uid) {
    const uniqueByCompany = await getUniqueMatchedData(
      'company_name',
      company,
      uid
    );
    const uniqueByJob = await getUniqueMatchedData('job_title', job, uid);

    const data = helper.compare(uniqueByCompany, uniqueByJob);
    const users = await Promise.all(
      data.map(async note => {
        const userData = await this.getUserInfo(note.creator);
        return { ...note, creator_info: userData };
      })
    );
    return users;
  },
  async getMoreMessages(roomId, message) {
    if (!message) return;
    const docSnaps = await getDocs(
      query(
        collection(db, `chatrooms/${roomId}/messages`),
        where('create_at', '<', Timestamp.fromMillis(message.create_at)),
        orderBy('create_at', 'desc'),
        limit(20)
      )
    );
    let data = [];
    docSnaps.forEach(doc => {
      data.push(doc.data());
    });
    const millisData = changeTimeIntoMillis(data, 'create_at');
    millisData.sort((a, b) => a.create_at - b.create_at);
    return millisData;
  },
  updateUser(name) {
    updateProfile(auth.currentUser, {
      displayName: name,
    });
  },
  async updateUserInfo(uid, data) {
    await updateDoc(doc(db, 'users', uid), data);
  },
  async updateRecord(uid, recordId, data) {
    const newDocRef = doc(db, `users/${uid}/records/${recordId}`);
    await updateDoc(newDocRef, data);
  },
  async updateNoteBrief(uid, noteId, data) {
    await updateDoc(doc(db, 'users', uid, 'notes', noteId), data);
  },
  async increaseDataNumber(path, key) {
    await updateDoc(doc(db, path), {
      [key]: increment(1),
    });
  },
  async updateNoteDetails(noteId, data) {
    await updateDoc(doc(db, 'details', noteId), data);
  },
  async updateRoom(roomId, data) {
    await updateDoc(doc(db, 'chatrooms', roomId), data);
  },
  listenUserProfileChange(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), doc => {
      callback(doc.data());
    });
  },
  listenUserRecordsChange(uid, audioCallback, videoCallback) {
    const q = query(
      collection(db, 'users', uid, 'records'),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, async docs => {
      let data = [];
      docs.forEach(doc => {
        data.push(doc.data());
      });
      const millisData = changeTimeIntoMillis(data, 'date');
      const transformed = millisData.map(record => {
        const timeString = useFormatedTime(record.date);
        return { ...record, date: timeString };
      });
      let audios = [];
      let videos = [];
      transformed.forEach(record => {
        if (record.type === 0) {
          audios.push(record);
        } else {
          videos.push(record);
        }
      });
      audioCallback(audios);
      videoCallback(videos);
    });
  },
  listenDetailsChange(noteId, callback) {
    return onSnapshot(doc(db, 'details', noteId), callback);
  },
  listenRoomsChange(uid, callback) {
    const q = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', uid),
      orderBy('latest.timestamp', 'desc')
    );
    return onSnapshot(q, async snapshot => {
      let data = [];
      snapshot.forEach(snap => {
        data.push(snap.data());
      });
      const rooms = await getCompleteRoomsData(data, uid);
      callback(rooms);
    });
  },
  listenMessagesChange(room, uid, callback) {
    const q = query(
      collection(db, 'chatrooms', room.id, 'messages'),
      orderBy('create_at', 'desc'),
      limit(20)
    );
    return onSnapshot(q, async snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        data.push(doc.data());
      });
      const millisData = changeTimeIntoMillis(data, 'create_at');
      millisData.sort((a, b) => a.create_at - b.create_at);
      callback(millisData);
      await changeReadStatus(room.id, uid);
    });
  },
  async createDoc(path, data, key) {
    const newDocRef = doc(collection(db, path));
    await setDoc(newDocRef, { ...data, [key]: newDocRef.id });
    return newDocRef.id;
  },
  async setNoteDetails(noteId, data) {
    await setDoc(doc(db, 'details', noteId), data);
  },
  async setNewUser(uid, value, url) {
    await setDoc(doc(db, 'users', uid), {
      display_name: value,
      photo_url: url || '',
    });
  },
  async deleteData(path) {
    await deleteDoc(doc(db, path));
  },
  async deleteFile(path) {
    const fileRef = ref(storage, path);
    deleteObject(fileRef);
  },
  async uploadFile(path, file) {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
  },
  async getDownloadURL(path) {
    const url = await getDownloadURL(ref(storage, path));
    return url;
  },
  async checkIsRoomExist(ids) {
    const myRooms = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', ids[0])
    );
    const querySnapshot = await getDocs(myRooms);
    let data = [];
    querySnapshot.forEach(doc => {
      if (doc.data().members.includes(ids[1])) {
        data.push(doc.data());
      }
    });
    return data;
  },
  async sendMessage(roomId, data) {
    const content = {
      latest: {
        timestamp: data.create_at,
        message: data.text,
        message_type: data.type,
      },
      receiver_has_read: false,
      latest_sender: data.uid,
      unread_qty: increment(1),
    };
    await this.updateRoom(roomId, content);
    await this.createDoc(`chatrooms/${roomId}/messages`, data, 'id');
  },
  checklogin(callback) {
    onAuthStateChanged(auth, callback);
  },
  signOut() {
    signOut(auth);
  },
  async register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },
  async signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  },
  async signInWithProvider(provider) {
    let result;
    if (provider === 'Google') {
      result = await signInWithPopup(auth, providerGoogle);
    }
    if (provider === 'Facebook') {
      result = await signInWithPopup(auth, providerFacebook);
    }
    const user = result.user;
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      return;
    } else {
      this.setNewUser(user.uid, user.displayName, user.photoURL);
    }
  },
  auth,
  Timestamp,
  increment,
};

export default firebase;
