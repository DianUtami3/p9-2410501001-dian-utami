import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
 apiKey: "AIzaSyAfKVhLyYbdzNVDvZw8MJ2EhP6zUx5iOgc",
  authDomain: "auth-praktikum-dianutami.firebaseapp.com",
  projectId: "auth-praktikum-dianutami",
  storageBucket: "auth-praktikum-dianutami.firebasestorage.app",
  messagingSenderId: "829652266393",
  appId: "1:829652266393:web:f8ad08d4dd8a6ceb173708",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);