// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfqdhWsodQZPtI6SEUZQqAYkaZ7GoeM4o",
  authDomain: "fit-league-930c6.firebaseapp.com",
  projectId: "fit-league-930c6",
  storageBucket: "fit-league-930c6.firebasestorage.app",
  messagingSenderId: "118216010041",
  appId: "1:118216010041:web:88c97c5b13c8dbf70ae0e8",
  measurementId: "G-Z0T76K4JK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
