// const firebaseConfig = {
//     apiKey: "AIzaSyBvkxpBkkNIdD0nIbKZ-c9imwNokUYQops",
//     authDomain: "observeme-38627.firebaseapp.com",
//     projectId: "observeme-38627",
//     storageBucket: "observeme-38627.appspot.com",
//     messagingSenderId: "255203850724",
//     appId: "1:255203850724:web:37989fad108d9fa2e1aff1",
//     measurementId: "G-CZJFBKMWV7"
//   };

// firebase config key setup
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBvkxpBkkNIdD0nIbKZ-c9imwNokUYQops",
    authDomain: "observeme-38627.firebaseapp.com",
    projectId: "observeme-38627",
    storageBucket: "observeme-38627.appspot.com",
    messagingSenderId: "255203850724",
    appId: "1:255203850724:web:37989fad108d9fa2e1aff1",
    measurementId: "G-CZJFBKMWV7"
  };

 
let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };