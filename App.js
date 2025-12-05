import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import AddEditStudentScreen from './src/screens/AddEditStudentScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // User belum login
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                title: 'Daftar Akun',
                headerStyle: {
                  backgroundColor: '#6200EE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        ) : (
          // User sudah login
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                title: 'KlikKampus',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="StudentList" 
              component={StudentListScreen}
              options={{ 
                title: 'Data Mahasiswa',
                headerStyle: {
                  backgroundColor: '#6200EE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="AddEditStudent" 
              component={AddEditStudentScreen}
              options={({ route }) => ({ 
                title: route.params?.student ? 'Edit Mahasiswa' : 'Tambah Mahasiswa',
                headerStyle: {
                  backgroundColor: '#6200EE',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;