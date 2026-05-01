import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';

import { auth, db } from '../config/firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const IDLE_LIMIT = 30 * 1000; // 30 detik

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutTimer = useRef(null);

  const getUserRole = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role;
    }

    return 'user';
  };

  const logout = async () => {
    await signOut(auth);
    await SecureStore.deleteItemAsync('auth_token');
    setUser(null);
    setRole(null);
  };

  const resetIdleTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    logoutTimer.current = setTimeout(() => {
      if (auth.currentUser) {
        logout();
      }
    }, IDLE_LIMIT);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();
        await SecureStore.setItemAsync('auth_token', token);

        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
      } else {
        await SecureStore.deleteItemAsync('auth_token');
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
      return;
    }

    resetIdleTimer();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        resetIdleTimer();
      }
    });

    return () => {
      subscription.remove();

      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}