import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCWsR5PrqtvVbsrnIWjHfrmny2mtJe9Wkc",
    authDomain: "eko-hw-gal-or.firebaseapp.com",
    databaseURL: "https://eko-hw-gal-or-default-rtdb.firebaseio.com",
    projectId: "eko-hw-gal-or",
    storageBucket: "eko-hw-gal-or.appspot.com",
    messagingSenderId: "215208908061",
    appId: "1:215208908061:web:4b115e166b6cff59bf3df4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
