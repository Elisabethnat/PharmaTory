import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAdsMu7TZdNbmWXHhuyT0O5ILwTbiI_jwU",
  authDomain: "pharmatoryapp.firebaseapp.com",
  databaseURL: "https://pharmatoryapp-default-rtdb.firebaseio.com",
  projectId: "pharmatoryapp",
  storageBucket: "pharmatoryapp.firebasestorage.app",
  messagingSenderId: "451403538666",
  appId: "1:451403538666:web:87fefabc0ef1eceda33793",
};


export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

//  Realtime Database
export const rtdb = getDatabase(app);

// Auth con persistencia 
let _auth;
try {
  _auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  
  _auth = getAuth(app);
}
export const auth = _auth;