# Auth Praktikum - Pertemuan 9

Aplikasi ini dibuat untuk praktikum Authentication dan Authorization menggunakan React Native Expo dan Firebase.

## Fitur Praktikum

1. Register menggunakan Firebase Authentication  
2. Login menggunakan email dan password  
3. Password reset melalui email  
4. Email verification setelah register  
5. Token disimpan menggunakan expo-secure-store  
6. Protected route menggunakan Auth Stack dan App Stack  
7. Biometric login menggunakan expo-local-authentication  

## Fitur Pengembangan Tugas Mandiri

1. Role-Based Authorization

Aplikasi memiliki dua role:

- user  
- admin  

Role disimpan di Firestore pada collection `users`.

- Jika role = **admin** → tombol **Admin Panel** muncul di Home Screen  
- Jika role = **user** → tidak bisa akses halaman Admin  

Halaman Admin juga dilindungi agar tidak bisa diakses langsung tanpa role admin.

2. Auto Logout Idle

Aplikasi memiliki fitur auto logout jika user tidak aktif selama: 15 detik

Fitur ini dibuat menggunakan:

- AppState (React Native)
- setTimeout

Saat user tidak berinteraksi, sistem akan otomatis logout dan kembali ke halaman Login untuk meningkatkan keamanan.

3. Refresh Token Rotation (Backend Express)

Aplikasi menggunakan backend sederhana dengan Node.js (Express) untuk:

- Generate Access Token
- Generate Refresh Token
- Rotasi refresh token

Token digunakan untuk meningkatkan keamanan session dan disimpan menggunakan SecureStore.

4. Google Sign-In (OAuth)

Aplikasi menyediakan fitur login menggunakan akun Google dengan OAuth menggunakan `expo-auth-session`.

Namun, fitur Google Sign-In belum dapat berjalan stabil pada Android, Web, maupun iOS karena proses OAuth memerlukan konfigurasi tambahan seperti redirect URI, Client ID per platform, package name, SHA-1 fingerprint, dan setup development build.

Pada Expo Go, Google Sign-In Google gagal karena keterbatasan OAuth redirect. Untuk implementasi penuh, aplikasi perlu dijalankan menggunakan development build/EAS Build dengan konfigurasi OAuth yang sesuai untuk setiap platform.

5. Profile Admin (Upload Foto)

Admin memiliki halaman profile khusus yang dapat:

- Menampilkan data user (email, role, UID)
- Upload foto profile dari galeri
- Menyimpan foto ke Firestore

Menggunakan:

- `expo-image-picker`

## Teknologi

- React Native  
- Expo  
- Firebase Authentication  
- Firebase Firestore  
- Expo SecureStore  
- Expo Local Authentication  
- Expo Image Picker  
- Expo Auth Session (Google OAuth)  
- Node.js (Express)  
- React Navigation  

## Cara Menjalankan Project

1. Install dependency
- npm install
2. Jalankan backend
- cd backend
- node server.js
3. Jalankan aplikasi Expo
- npx expo start

## Fitur yang dapat diuji:
-Link video demo:
Youtube https://youtu.be/YWdSrpfkPIs?feature=shared, Gdrive https://drive.google.com/file/d/1ytKxsNoAtAJaOAAvNJQHxN4LOsNJy7uw/view?usp=drivesdk 
- Register → verifikasi email → login  
- Login biometric (Face ID / fingerprint)  
- Reset password  
- Role-based admin access  
- Auto logout (15 detik idle)  
- Refresh token rotation  
- Upload foto profile admin  

## Kesimpulan

Aplikasi ini berhasil mengimplementasikan konsep:

- Authentication menggunakan Firebase  
- Authorization menggunakan role-based system  
- Security enhancement dengan biometric dan auto logout  
- Token management menggunakan backend
