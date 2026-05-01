import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { rotateRefreshToken } from '../services/tokenService';

export default function HomeScreen({ navigation }) {
  const { user, role, logout } = useAuth();

  const handleRefreshToken = async () => {
    try {
      await rotateRefreshToken();
      Alert.alert('Berhasil', 'Refresh token berhasil dirotasi.');
    } catch (error) {
      Alert.alert('Gagal', error.message);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.card}>
        <Text style={styles.smallTitle}>AUTH PRAKTIKUM</Text>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.profileBox}>
          <Text style={styles.profileInitial}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.emailText}>{user?.email}</Text>
            <Text style={styles.roleBadge}>{role}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Kamu berhasil masuk ke halaman protected. Akses halaman ini hanya
          diberikan kepada user yang sudah login.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleRefreshToken}>
          <Text style={styles.primaryButtonText}>Rotate Refresh Token</Text>
        </TouchableOpacity>

        {role === 'admin' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={styles.adminButtonText}>Masuk ke Admin Panel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  decorTop: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8B7B0',
  },
  decorBottom: {
    position: 'absolute',
    bottom: -90,
    right: -80,
    width: 230,
    height: 230,
    borderRadius: 115,
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
    fontSize: 32,
    fontWeight: '900',
    color: '#5B342B',
    textAlign: 'center',
    marginBottom: 24,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F4',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6C8C0',
    marginBottom: 18,
  },
  profileInitial: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#A5655E',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 54,
    fontSize: 24,
    fontWeight: '900',
    marginRight: 14,
    overflow: 'hidden',
  },
  emailText: {
    color: '#4B2E27',
    fontSize: 15,
    fontWeight: '700',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#F3D8D2',
    color: '#7A463D',
    fontWeight: '900',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  description: {
    color: '#8A6A61',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#A5655E',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  adminButton: {
    backgroundColor: '#FFF7F4',
    borderWidth: 1,
    borderColor: '#A5655E',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  adminButtonText: {
    color: '#7A463D',
    fontWeight: '900',
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: '#F8E7E3',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#9F3D36',
    fontWeight: '900',
    fontSize: 15,
  },
});