import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AdminScreen({ navigation }) {
  const { user, role } = useAuth();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setPhoto(snap.data().photo || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Izin ditolak', 'Aplikasi butuh akses galeri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhoto(uri);

        // simpan ke Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          photo: uri,
        });

        Alert.alert('Berhasil', 'Foto profile berhasil diupdate.');
      }
    } catch (error) {
      Alert.alert('Gagal', error.message);
    }
  };

  if (role !== 'admin') {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Akses Ditolak</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Admin Profile</Text>

        {/* FOTO */}
        <TouchableOpacity onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.changeText}>Tap untuk ganti foto</Text>

        {/* INFO */}
        <View style={styles.profileBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{role}</Text>

          <Text style={styles.label}>UID</Text>
          <Text style={styles.valueSmall}>{user?.uid}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8EFEA',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFDFB',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0D8D2',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#5B342B',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#A5655E',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },
  changeText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#A5655E',
    marginBottom: 16,
  },
  profileBox: {
    backgroundColor: '#FFF7F4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#8B6F62',
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    color: '#4B2E27',
  },
  valueSmall: {
    fontSize: 11,
    color: '#4B2E27',
  },
  button: {
    backgroundColor: '#A5655E',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});