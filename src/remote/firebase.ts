import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBBy5kWuvyTOS_3v1iTfPnfilVukzJaYXA',
  authDomain: 'bangtrip-7d571.firebaseapp.com',
  projectId: 'bangtrip-7d571',
  storageBucket: 'bangtrip-7d571.appspot.com',
  messagingSenderId: '248610763978',
  appId: '1:248610763978:web:9a30c9095629670549b033',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const store = getFirestore(app);
