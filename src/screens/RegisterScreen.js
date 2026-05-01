import React, { useState } from 'react';
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
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Gagal', 'Email dan password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Gagal', 'Password minimal 6 karakter.');
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, 'users', credential.user.uid), {
        email: email.trim(),
        role: 'user',
        emailVerified: false,
      });

      await sendEmailVerification(credential.user);

      Alert.alert(
        'Registrasi Berhasil',
        'Akun berhasil dibuat. Link verifikasi sudah dikirim ke email kamu. Silakan cek Inbox/Spam, lalu klik link verifikasi.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Register gagal', error.message);
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
        <Text style={styles.smallTitle}>CREATE ACCOUNT</Text>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>
          Daftar akun baru untuk menggunakan fitur authentication dan protected route.
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
          placeholder="Minimal 6 karakter"
          placeholderTextColor="#B08A86"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>Daftar</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Setelah daftar, cek email kamu dan klik link verifikasi dari Firebase.
        </Text>

        <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
          Sudah punya akun? <Text style={styles.loginLink}>Login</Text>
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
  note: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: '#8A6A61',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#8A6A61',
    fontSize: 14,
  },
  loginLink: {
    color: '#A5655E',
    fontWeight: '900',
  },
});