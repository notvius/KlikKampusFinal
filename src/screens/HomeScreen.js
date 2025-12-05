import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StorageService from '../services/StorageService';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await StorageService.getUserData();
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              await StorageService.clearAll();
              navigation.replace('Login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: '📊 Dashboard',
      description: 'Statistik dan ringkasan',
      icon: 'dashboard',
      color: '#4CAF50',
      screen: 'Dashboard',
    },
    {
      id: 2,
      title: '📚 Data Mahasiswa',
      description: 'Kelola data mahasiswa',
      icon: 'school',
      color: '#2196F3',
      screen: 'StudentList',
    },
    {
      id: 3,
      title: '👤 Profile',
      description: 'Kelola akun Anda',
      icon: 'person',
      color: '#FF9800',
      screen: 'Profile',
    },
    {
      id: 4,
      title: '⚙️ Settings',
      description: 'Pengaturan aplikasi',
      icon: 'settings',
      color: '#9C27B0',
      screen: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.userName}>
            {userData?.displayName || userData?.email || 'User'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => Alert.alert('Info', 'Fitur profile akan datang')}
        >
          <Icon name="person" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Mahasiswa</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Jurusan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Angkatan</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen === 'StudentList') {
                  navigation.navigate('StudentList');
                } else {
                  Alert.alert('Info', `Fitur ${item.title} akan datang`);
                }
              }}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Icon name="notifications" size={20} color="#6200EE" />
            <Text style={styles.activityTitle}>Tidak ada aktivitas</Text>
          </View>
          <Text style={styles.activityText}>
            Belum ada aktivitas terbaru. Mulai dengan menambahkan data mahasiswa.
          </Text>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
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
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#6200EE',
  },
  welcomeText: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HomeScreen;