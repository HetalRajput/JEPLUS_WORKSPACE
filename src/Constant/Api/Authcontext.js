import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

  useEffect(() => {
    // Fetch token, role, and subRole from AsyncStorage on app start
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedRole = await AsyncStorage.getItem('role');
        const storedSubRole = await AsyncStorage.getItem('subRole');

        if (storedToken) setToken(storedToken);
        if (storedRole) setRole(storedRole);
        if (storedSubRole) setSubRole(storedSubRole);
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
  
    try {
      console.log('Attempting login with:', username, password);
  
      const response = await axios.post('http://jemapps.in/api/auth/login', {
        username,
        password,
      });
  
      if (response?.status === 200 && response?.data) {
        const { token, role, subrole } = response.data; // Extract subrole
  
        // Save token and role in AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('role', role);
  
        // Check if subrole exists before saving
        if (subrole) {
          await AsyncStorage.setItem('subRole', subrole);
          setSubRole(subrole);
        } else {
          await AsyncStorage.removeItem('subRole'); // Ensure no stale value is stored
          setSubRole(null);
        }
  
        // Update state
        setToken(token);
        setRole(role);
  
        console.log('Login successful:', response.data);
        return response;
      } else {
        throw new Error('Invalid credentials or unexpected response structure.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'role', 'subRole']); // Remove all keys at once
      setToken(null);
      setRole(null);
      setSubRole(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, subRole, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
