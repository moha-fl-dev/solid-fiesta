import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNG23UtRrvEJKaNuXWIcLlCahcyt1bapo",
    authDomain: "vensyan-b81cb.firebaseapp.com",
    projectId: "vensyan-b81cb",
    storageBucket: "vensyan-b81cb.appspot.com",
    messagingSenderId: "229717902220",
    appId: "1:229717902220:web:33c6562dcc1e2f4c1f0ca9"
};


if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}


const firestore = firebase.firestore();

export {firestore}