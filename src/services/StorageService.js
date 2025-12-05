import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService = {
  // Simpan data user
  setUserData: async (userData) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  },

  // Ambil data user
  getUserData: async () => {
    try {
      const data = await AsyncStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Simpan remember me
  setRememberMe: async (email, password) => {
    try {
      await AsyncStorage.setItem('remember_email', email);
      await AsyncStorage.setItem('remember_password', password);
      return true;
    } catch (error) {
      console.error('Error saving remember me:', error);
      return false;
    }
  },

  // Ambil remember me
  getRememberMe: async () => {
    try {
      const email = await AsyncStorage.getItem('remember_email');
      const password = await AsyncStorage.getItem('remember_password');
      return { email, password };
    } catch (error) {
      console.error('Error getting remember me:', error);
      return { email: null, password: null };
    }
  },

  // Hapus semua data
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

export default StorageService;