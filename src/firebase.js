import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  addDoc as firestoreAddDoc,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_SB02CZe7SrLhzSs-u6QXsRKCd4tVcZk",
  authDomain: "authentification-77c38.firebaseapp.com",
  projectId: "authentification-77c38",
  storageBucket: "authentification-77c38.firebasestorage.app",
  messagingSenderId: "940734075114",
  appId: "1:940734075114:web:0d27cdc6647e09eb440793"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager()
  })
});

export const usersCollection = collection(db, 'users');
export const projetCollection = collection(db, 'projets');
export const addDoc = firestoreAddDoc;
