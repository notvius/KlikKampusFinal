import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FirestoreService from '../services/FirestoreService';

const AddEditStudentScreen = ({ navigation, route }) => {
  const { student } = route.params || {};
  const isEditMode = !!student;

  const [form, setForm] = useState({
    nim: '',
    nama: '',
    jurusan: '',
    angkatan: '',
    email: '',
    telepon: '',
    alamat: '',
  });

  const [loading, setLoading] = useState(false);
  const [jurusanList] = useState([
    'Teknik Informatika',
    'Sistem Informasi',
    'Teknik Komputer',
    'Manajemen Informatika',
    'Ilmu Komputer',
    'Teknologi Informasi'
  ]);

  useEffect(() => {
    if (isEditMode && student) {
      setForm({
        nim: student.nim || '',
        nama: student.nama || '',
        jurusan: student.jurusan || '',
        angkatan: student.angkatan || '',
        email: student.email || '',
        telepon: student.telepon || '',
        alamat: student.alamat || '',
      });
    }

    // Set judul screen
    navigation.setOptions({
      title: isEditMode ? 'Edit Mahasiswa' : 'Tambah Mahasiswa',
    });
  }, [student, isEditMode, navigation]);

  const handleSave = async () => {
    // Validasi
    if (!form.nim.trim()) {
      Alert.alert('Error', 'NIM harus diisi');
      return;
    }

    if (!form.nama.trim()) {
      Alert.alert('Error', 'Nama harus diisi');
      return;
    }

    if (!form.jurusan) {
      Alert.alert('Error', 'Jurusan harus dipilih');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update data
        const result = await FirestoreService.updateStudent(student.id, form);
        if (result.success) {
          Alert.alert('Sukses', 'Data mahasiswa berhasil diupdate', [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]);
        } else {
          Alert.alert('Error', result.error || 'Gagal mengupdate data');
        }
      } else {
        // Tambah data baru
        const result = await FirestoreService.addStudent(form);
        if (result.success) {
          Alert.alert('Sukses', 'Data mahasiswa berhasil ditambahkan', [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]);
        } else {
          Alert.alert('Error', result.error || 'Gagal menambahkan data');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const updateForm = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email) => {
    if (!email) return true; // Email optional
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone optional
    const re = /^[0-9+\-\s()]*$/;
    return re.test(phone);
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
        <View style={styles.form}>
          {/* NIM */}
          <Text style={styles.label}>NIM *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan NIM"
            value={form.nim}
            onChangeText={(text) => updateForm('nim', text)}
            placeholderTextColor="#999"
            maxLength={20}
          />

          {/* Nama */}
          <Text style={styles.label}>Nama Lengkap *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama lengkap"
            value={form.nama}
            onChangeText={(text) => updateForm('nama', text)}
            placeholderTextColor="#999"
          />

          {/* Jurusan */}
          <Text style={styles.label}>Jurusan *</Text>
          <View style={styles.jurusanContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.jurusanScroll}
            >
              {jurusanList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.jurusanItem,
                    form.jurusan === item && styles.jurusanItemSelected
                  ]}
                  onPress={() => updateForm('jurusan', item)}
                >
                  <Text style={[
                    styles.jurusanText,
                    form.jurusan === item && styles.jurusanTextSelected
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {form.jurusan && (
              <Text style={styles.selectedJurusan}>Terpilih: {form.jurusan}</Text>
            )}
          </View>

          {/* Angkatan */}
          <Text style={styles.label}>Angkatan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 2023"
            value={form.angkatan}
            onChangeText={(text) => updateForm('angkatan', text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholderTextColor="#999"
            maxLength={4}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              form.email && !validateEmail(form.email) && styles.inputError
            ]}
            placeholder="email@example.com"
            value={form.email}
            onChangeText={(text) => updateForm('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          {form.email && !validateEmail(form.email) && (
            <Text style={styles.errorText}>Format email tidak valid</Text>
          )}

          {/* Telepon */}
          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={[
              styles.input,
              form.telepon && !validatePhone(form.telepon) && styles.inputError
            ]}
            placeholder="081234567890"
            value={form.telepon}
            onChangeText={(text) => updateForm('telepon', text)}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            maxLength={15}
          />
          {form.telepon && !validatePhone(form.telepon) && (
            <Text style={styles.errorText}>Format telepon tidak valid</Text>
          )}

          {/* Alamat */}
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Masukkan alamat lengkap"
            value={form.alamat}
            onChangeText={(text) => updateForm('alamat', text)}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />

          {/* Info */}
          <View style={styles.infoBox}>
            <Icon name="info" size={16} color="#6200EE" />
            <Text style={styles.infoText}>* Menandakan field wajib diisi</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>BATAL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!form.nim || !form.nama || !form.jurusan) && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={loading || !form.nim || !form.nama || !form.jurusan}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'UPDATE' : 'SIMPAN'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
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
    padding: 16,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 4,
    marginLeft: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  jurusanContainer: {
    marginBottom: 8,
  },
  jurusanScroll: {
    marginBottom: 8,
  },
  jurusanItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  jurusanItemSelected: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  jurusanText: {
    fontSize: 14,
    color: '#666',
  },
  jurusanTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedJurusan: {
    fontSize: 12,
    color: '#6200EE',
    fontStyle: 'italic',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#6200EE',
    marginLeft: 8,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEditStudentScreen;