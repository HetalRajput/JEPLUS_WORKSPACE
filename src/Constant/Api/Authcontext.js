import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../../Screens/Authentication/Splashscreen';
// Create Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [subRole, setSubRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load authentication data from AsyncStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedRole = await AsyncStorage.getItem('role');
        const storedSubRole = await AsyncStorage.getItem('subRole');
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedRole) {
          setRole(storedRole);
        }
        if (storedSubRole) {
          setSubRole(storedSubRole);
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
        setError('Failed to load authentication data.');
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Save authentication data to state and AsyncStorage
  const saveAuthData = async (token, role, subRole) => {

    
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('subRole', subRole);
      setToken(token);
      setRole(role);
      setSubRole(subRole);
    } catch (err) {
      console.error('Error saving auth data:', err);
      setError('Failed to save authentication data.');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'role', 'subRole']);
      setToken(null);
      setRole(null);
      setSubRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <AuthContext.Provider
      value={{ token, role, subRole, loading, error, saveAuthData, logout, setSubRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
