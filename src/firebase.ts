import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZtnQLBeKaKXbUaVLz8-cXHicpSs3D1qU",
    authDomain: "react-demo-b7bf0.firebaseapp.com",
    projectId: "react-demo-b7bf0",
    storageBucket: "react-demo-b7bf0.firebasestorage.app",
    messagingSenderId: "779569441765",
    appId: "1:779569441765:web:3c3d0ea028f3c6817add0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
