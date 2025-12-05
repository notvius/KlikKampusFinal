import firestore from '@react-native-firebase/firestore';

const FirestoreService = {
  studentsCollection: firestore().collection('mahasiswa'),
  usersCollection: firestore().collection('users'),

  // Simpan data user ke Firestore
  saveUserData: async (userId, userData) => {
    try {
      await FirestoreService.usersCollection.doc(userId).set({
        ...userData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        role: 'user'
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Ambil semua data mahasiswa
  getAllStudents: async () => {
    try {
      const snapshot = await FirestoreService.studentsCollection
        .orderBy('createdAt', 'desc')
        .get();

      const students = [];
      snapshot.forEach(doc => {
        students.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Tambah data mahasiswa
  addStudent: async (studentData) => {
    try {
      const docRef = await FirestoreService.studentsCollection.add({
        ...studentData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update data mahasiswa
  updateStudent: async (studentId, studentData) => {
    try {
      await FirestoreService.studentsCollection
        .doc(studentId)
        .update({
          ...studentData,
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Hapus data mahasiswa
  deleteStudent: async (studentId) => {
    try {
      await FirestoreService.studentsCollection.doc(studentId).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search mahasiswa
  searchStudents: async (searchText) => {
    try {
      const snapshot = await FirestoreService.studentsCollection
        .orderBy('nama')
        .startAt(searchText)
        .endAt(searchText + '\uf8ff')
        .get();

      const students = [];
      snapshot.forEach(doc => {
        students.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default FirestoreService;