import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { auth, db } from '../config/firebase';
import { requestBackendTokens } from '../services/tokenService';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '829652266393-qe5th22tha09mvm87ob94od56pv73hgn.apps.googleusercontent.com',
    iosClientId:
      '829652266393-7fodrkmnen992pg7a2nknq9k7vb6ie6n.apps.googleusercontent.com',
    webClientId:
      '829652266393-ldr4f6a8r5700rdjubj499i0mh8aok3b.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    try {
      if (!idToken) {
        Alert.alert('Gagal', 'ID Token Google tidak ditemukan.');
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, googleCredential);

      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          role: 'user',
          provider: 'google',
          emailVerified: result.user.emailVerified,
        });
      }

      await requestBackendTokens(result.user.uid, result.user.email);
      Alert.alert('Berhasil', 'Login Google berhasil + token backend dibuat.');
    } catch (error) {
      Alert.alert('Google Login gagal', error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gagal', 'Email dan password wajib diisi.');
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (!credential.user.emailVerified) {
        Alert.alert(
          'Email belum diverifikasi',
          'Silakan cek email dan klik link verifikasi terlebih dahulu.'
        );
        return;
      }

      await SecureStore.setItemAsync('saved_email', email.trim());
      await SecureStore.setItemAsync('saved_password', password);
      await requestBackendTokens(credential.user.uid, credential.user.email);

      Alert.alert('Berhasil', 'Login berhasil.');
    } catch (error) {
      Alert.alert('Login gagal', error.message);
    }
  };

  const handleBiometric = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync('saved_email');
      const savedPassword = await SecureStore.getItemAsync('saved_password');

      if (!savedEmail || !savedPassword) {
        Alert.alert(
          'Belum ada akun tersimpan',
          'Silakan login pakai email dan password dulu sekali.'
        );
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Gagal', 'Device tidak mendukung biometric.');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          'Gagal',
          'Face ID, fingerprint, atau passcode belum diatur di device.'
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login dengan Face ID / Fingerprint',
        fallbackLabel: 'Gunakan passcode',
        cancelLabel: 'Batal',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const credential = await signInWithEmailAndPassword(
          auth,
          savedEmail,
          savedPassword
        );

        await requestBackendTokens(credential.user.uid, credential.user.email);
        Alert.alert('Berhasil', 'Login biometric berhasil.');
      } else {
        Alert.alert('Gagal', 'Biometric dibatalkan atau tidak cocok.');
      }
    } catch (error) {
      Alert.alert('Biometric gagal', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.card}>
        <Text style={styles.smallTitle}>AUTH PRAKTIKUM</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>
          Masuk untuk melanjutkan ke aplikasi authentication dan authorization.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email"
          placeholderTextColor="#B08A86"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password"
          placeholderTextColor="#B08A86"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.googleText}>Login dengan Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bioButton} onPress={handleBiometric}>
          <Text style={styles.bioText}>Login dengan Face ID / Biometric</Text>
        </TouchableOpacity>

        <Text
          style={styles.registerText}
          onPress={() => navigation.navigate('Register')}
        >
          Belum punya akun? <Text style={styles.registerLink}>Daftar</Text>
        </Text>

        <Text
          style={styles.forgotText}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          Lupa password?
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8EFEA',
    justifyContent: 'center',
    padding: 24,
  },
  decorTop: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#E8B7B0',
  },
  decorBottom: {
    position: 'absolute',
    bottom: -90,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#B88973',
    opacity: 0.25,
  },
  card: {
    backgroundColor: '#FFFDFB',
    borderRadius: 30,
    padding: 26,
    borderWidth: 1,
    borderColor: '#F0D8D2',
    shadowColor: '#6B3F34',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  smallTitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#A5655E',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 31,
    fontWeight: '900',
    color: '#5B342B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A6A61',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B3F34',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6C8C0',
    backgroundColor: '#FFF7F4',
    padding: 14,
    marginBottom: 14,
    borderRadius: 16,
    color: '#4B2E27',
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#A5655E',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5C7C0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  googleText: {
    color: '#6B3F34',
    fontSize: 15,
    fontWeight: '700',
  },
  bioButton: {
    backgroundColor: '#F3D8D2',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  bioText: {
    color: '#7A463D',
    fontSize: 15,
    fontWeight: '800',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#8A6A61',
    fontSize: 14,
  },
  registerLink: {
    color: '#A5655E',
    fontWeight: '900',
  },
  forgotText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#A5655E',
    fontSize: 14,
    fontWeight: '800',
  },
});