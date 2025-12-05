import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FirestoreService from '../services/FirestoreService';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const result = await FirestoreService.getAllStudents();
    if (result.success) {
      setStudents(result.data);
    } else {
      Alert.alert('Error', result.error || 'Gagal memuat data mahasiswa');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    const result = await FirestoreService.searchStudents(searchText);
    if (result.success) {
      setStudents(result.data);
    } else {
      Alert.alert('Error', result.error || 'Gagal mencari data');
    }
    setLoading(false);
  };

  const handleDelete = (student) => {
    Alert.alert(
      'Hapus Data',
      `Apakah Anda yakin ingin menghapus ${student.nama}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const result = await FirestoreService.deleteStudent(student.id);
            if (result.success) {
              Alert.alert('Sukses', 'Data berhasil dihapus');
              loadStudents(); // Refresh list
            } else {
              Alert.alert('Error', result.error || 'Gagal menghapus data');
            }
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddEditStudent', { student: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.nama}</Text>
          <Text style={styles.studentNim}>NIM: {item.nim || '-'}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('AddEditStudent', { student: item });
            }}
          >
            <Icon name="edit" size={20} color="#6200EE" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
          >
            <Icon name="delete" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="school" size={16} color="#666" />
          <Text style={styles.infoText}>{item.jurusan || 'Jurusan tidak diisi'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.infoText}>Angkatan: {item.angkatan || '-'}</Text>
        </View>

        {item.email ? (
          <View style={styles.infoRow}>
            <Icon name="email" size={16} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>{item.email}</Text>
          </View>
        ) : null}

        {item.telepon ? (
          <View style={styles.infoRow}>
            <Icon name="phone" size={16} color="#666" />
            <Text style={styles.infoText}>{item.telepon}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.timestamp}>
          Ditambahkan: {formatDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Mahasiswa</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditStudent', { student: null })}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari mahasiswa (nama/NIM)..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <>
          {/* Empty State */}
          {students.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="school" size={64} color="#ddd" />
              <Text style={styles.emptyText}>
                {searchText ? 'Data tidak ditemukan' : 'Belum ada data mahasiswa'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchText
                  ? 'Coba kata kunci lain'
                  : 'Tambahkan data mahasiswa pertama Anda'
                }
              </Text>
              {!searchText && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('AddEditStudent', { student: null })}
                >
                  <Text style={styles.emptyButtonText}>+ Tambah Mahasiswa</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* Student List */
            <FlatList
              data={students}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#6200EE']}
                  tintColor="#6200EE"
                />
              }
              ListHeaderComponent={
                <Text style={styles.listHeader}>
                  {students.length} mahasiswa ditemukan
                </Text>
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#6200EE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  listHeader: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentNim: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default StudentListScreen;