import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import StorageService from '../services/StorageService';

const RegisterScreen = ({ navigation }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validasi
    if (!nama || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      // 1. Register di Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // 2. Update profile dengan nama
      await userCredential.user.updateProfile({
        displayName: nama
      });

      // 3. Simpan ke AsyncStorage
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        displayName: nama,
      };
      await StorageService.setUserData(userData);

      // 4. Simpan data user ke Firestore
      await firestore().collection('users').doc(userCredential.user.uid).set({
        nama: nama,
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        role: 'user'
      });

      Alert.alert(
        'Registrasi Berhasil',
        'Akun Anda berhasil dibuat!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home')
          }
        ]
      );

    } catch (error) {
      let errorMessage = 'Registrasi gagal';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email sudah terdaftar';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password terlalu lemah';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Koneksi internet bermasalah';
          break;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daftar Akun Baru</Text>
          <Text style={styles.subtitle}>Buat akun untuk mengakses KlikKampus</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            value={nama}
            onChangeText={setNama}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <View style={styles.passwordRules}>
            <Text style={styles.ruleText}>• Password minimal 6 karakter</Text>
            <Text style={styles.ruleText}>• Gunakan kombinasi huruf dan angka</Text>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>DAFTAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Sudah punya akun? <Text style={styles.loginTextBold}>Login</Text></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dengan mendaftar, Anda menyetujui Syarat & Ketentuan
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordRules: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  ruleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  registerButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;