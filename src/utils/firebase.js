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
  addDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import helper from '../hooks/helper';
import useFormatedTime from '../hooks/useFormatedTime';

import useRelativeTime from '../hooks/useRelativeTime';

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
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

const firebase = {
  updateUser(name) {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('updated');
      })
      .catch((error) => {
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
    } catch (err) {
      console.log(err);
    }
  },
  listenUserProfileChange(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      callback((prev) => {
        return { ...prev, ...doc.data() };
      });
    });
  },
  listenUserRecordsChange(uid, setAudioRecords, setVideoRecords) {
    const q = query(
      collection(db, 'users', uid, 'records'),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, async (docs) => {
      let data = [];
      docs.forEach((doc) => {
        data.push(doc.data());
      });
      const transformed = data.map((record) => {
        const timeString = useFormatedTime(record.date);
        return { ...record, date: timeString };
      });
      const audios = transformed.filter((record) => record.type === 0);
      const videos = transformed.filter((record) => record.type === 1);
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
  async getWholeCollection(category) {
    const docsSnap = await getDocs(collection(db, category));
    const data = [];
    docsSnap.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  },
  async createDoc(category, data) {
    const newDocRef = doc(collection(db, category));
    try {
      await setDoc(newDocRef, { ...data, id: newDocRef.id });
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
    const docSnaps = await getDocs(collection(db, `users/${uid}/notes`));
    const notesArray = [];
    docSnaps.forEach((doc) => {
      notesArray.push(doc.data());
    });
    return notesArray;
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
  listenDetailsChange(noteId, callback) {
    return onSnapshot(doc(db, 'details', noteId), callback);
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
  checklogin(callback) {
    onAuthStateChanged(auth, callback);
  },
  async signUp(uid, value, url) {
    try {
      await setDoc(doc(db, 'users', uid), {
        display_name: value,
        photo_url: url,
      });
    } catch (err) {
      console.log(err);
    }
  },
  signOut() {
    return signOut(auth);
  },
  async getRecommendedUsers(company, job, uid) {
    const membersByCompany = query(
      collectionGroup(db, 'notes'),
      where('company_name', '==', company),
      where('is_share', '==', true),
      limit(7)
    );
    const querySnapshot = await getDocs(membersByCompany);
    let dataByCompany = [];
    querySnapshot.forEach((doc) => {
      dataByCompany.push(doc.data());
    });
    const uniqueByCompany = helper.findUnique(dataByCompany);

    const membersByJob = query(
      collectionGroup(db, 'notes'),
      where('job_title', '==', job),
      where('is_share', '==', true),
      limit(7)
    );
    const Snapshots = await getDocs(membersByJob);
    let dataByJob = [];
    Snapshots.forEach((doc) => {
      dataByJob.push(doc.data());
    });
    const uniqueByJob = helper.findUnique(dataByJob);
    const data = helper.compare(uniqueByCompany, uniqueByJob);
    const users = await Promise.all(
      data.map(async (note) => {
        const userData = await this.getUserInfo(note.creator);
        return { ...note, creator_info: userData };
      })
    );
    const filteredData = users.filter((item) => item.creator !== uid);
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
    try {
      deleteObject(fileRef);
    } catch (error) {
      console.log(error);
    }
  },
  async getDownloadURL(path) {
    return getDownloadURL(ref(storage, path))
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error);
      });
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
  async checkIsRoomExist(ids) {
    const myRooms = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', ids[0])
    );
    const querySnapshot = await getDocs(myRooms);
    let data = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().members.includes(ids[1])) {
        data.push(doc.data());
      }
    });
    return data;
  },
  listenRoomsChange(uid, callback) {
    const q = query(
      collection(db, 'chatrooms'),
      where('members', 'array-contains', uid),
      orderBy('latest.timestamp', 'desc')
    );
    return onSnapshot(q, async (snapshot) => {
      let data = [];
      snapshot.forEach((snap) => {
        data.push(snap.data());
      });
      const rooms = await Promise.all(
        data.map(async (room) => {
          const timeRelative = useRelativeTime(room);
          const friendId = room.members.filter((id) => id !== uid);
          const userData = await this.getUserInfo(friendId[0]);
          return {
            ...room,
            members: userData,
            latest: { ...room.latest, timestamp: timeRelative },
          };
        })
      );
      callback(rooms);
    });
  },
  async getUserInfo(uid) {
    const docSnap = await getDoc(doc(db, 'users', uid));
    const display_name = docSnap.data().display_name;
    const photo = docSnap.data().photo_url ? docSnap.data().photo_url : '';
    return { display_name, photo_url: photo };
  },
  async getMoreMessages(roomId, message) {
    if (!message) return;
    console.log('firebase', message);
    const docSnaps = await getDocs(
      query(
        collection(db, `chatrooms/${roomId}/messages`),
        where('create_at', '<', message.create_at),
        orderBy('create_at', 'desc'),
        limit(20)
      )
    );
    let data = [];
    docSnaps.forEach((doc) => {
      data.push(doc.data());
    });
    data.sort((a, b) => !b.create_at - a.create_at);
    return data;
  },
  listenMessagesChange(room, callback, uid) {
    const q = query(
      collection(db, 'chatrooms', room.id, 'messages'),
      orderBy('create_at', 'desc'),
      limit(20)
    );
    return onSnapshot(
      q,
      async (snapshot) => {
        console.log('msg listener 1');
        let data = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            data.push(change.doc.data());
          }
        });
        data.sort((a, b) => !b.create_at - a.create_at);
        callback((prev) => {
          if (!prev[room.id]) {
            return {
              ...prev,
              [room.id]: data,
            };
          } else {
            // 我這邊是先比較後來監聽拿到的 messages 是不是已經存在之前的 state 中
            const stateIds = prev[room.id].map(item => item.id);
            const dataIds = data.map(item => item.id);
            const filteredIds = dataIds.filter(id => stateIds.indexOf(id) === -1);
            if (filteredIds.length === 0) return prev;
            const filteredData = data.filter(message => filteredIds.indexOf(message.id) !== -1);
            return { ...prev, [room.id]: [...prev[room.id], ...filteredData] };
          }
        });
        const roomSnap = await getDoc(doc(db, 'chatrooms', room.id));
        const lastSender = roomSnap.data().latest_sender;
        if (uid === lastSender) return;
        this.updateRoom(room.id, { receiver_has_read: true, unread_qty: 0 });
      },
      (error) => {
        console.error(error);
      }
    );
  },
  async checkUnreadQty(roomId) {
    const docSnap = await getDoc(doc(db, 'chatrooms', roomId));
    const unreadQty = docSnap.data().unread_qty || 0;
    return unreadQty;
  },
  async sendMessage(roomId, data) {
    try {
      const unreadQty = await this.checkUnreadQty(roomId);
      console.log(unreadQty);
      await updateDoc(doc(db, 'chatrooms', roomId), {
        latest: {
          timestamp: data.create_at,
          message: data.text,
          message_type: data.type,
        },
        receiver_has_read: false,
        latest_sender: data.uid,
        unread_qty: unreadQty + 1,
      });
      const newDocRef = doc(collection(db, 'chatrooms', roomId, 'messages'));
      await setDoc(newDocRef, { ...data, id: newDocRef.id });
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
      this.signUp(user.uid, user.displayName, user.photoURL);
    }
  },
  async updateUserInfoWithProvider(uid, name, photoUrl) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        display_name: name,
        photo_url: photoUrl,
      });
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
