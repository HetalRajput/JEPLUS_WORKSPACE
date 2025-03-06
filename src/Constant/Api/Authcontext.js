import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../../Screens/Authentication/Splashscreen';

// Create Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState([]); // Store all roles assigned to the user
  const [activeRole, setActiveRole] = useState(null); // Currently selected role
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load authentication data from AsyncStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedRole = await AsyncStorage.getItem('role');
        const storedActiveRole = await AsyncStorage.getItem('activeRole');

        if (storedToken) setToken(storedToken);

        if (storedRole) {
          const parsedRoles = JSON.parse(storedRole);
          setRole(parsedRoles);

          // Set default active role: EMPLOYEE or first available role
          const defaultRole = parsedRoles.includes('EMPLOYEE') ? 'EMPLOYEE' : parsedRoles[0] || null;
          const finalActiveRole = storedActiveRole || defaultRole;

          await AsyncStorage.setItem('activeRole', finalActiveRole);
          setActiveRole(finalActiveRole);
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
        setError('Failed to load authentication data.');
      } finally {
        setTimeout(() => setLoading(false), 500); // Small delay ensures state updates propagate
      }
    };

    loadAuthData();
  }, []);

  // Save authentication data to state and AsyncStorage
  const saveAuthData = async (token, roles) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('role', JSON.stringify(roles));
      setToken(token);
      setRole(roles);

      // Set "EMPLOYEE" as default active role or the first available role
      const defaultRole = roles.includes('EMPLOYEE') ? 'EMPLOYEE' : roles[0] || null;
      await AsyncStorage.setItem('activeRole', defaultRole);
      setActiveRole(defaultRole);
    } catch (err) {
      console.error('Error saving auth data:', err);
      setError('Failed to save authentication data.');
    } finally {
      setLoading(false);
    }
  };

  // Switch Profile (Change active role)
  const switchProfile = async (newRole) => {
    if (!role.includes(newRole)) {
      console.error('Role not assigned to the user.');
      return;
    }

    try {
      await AsyncStorage.setItem('activeRole', newRole);
      setActiveRole(newRole);
    } catch (err) {
      console.error('Error switching role:', err);
      setError('Failed to switch profile.');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'role', 'activeRole']);
      setToken(null);
      setRole([]);
      setActiveRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ token, role, activeRole, loading, error, saveAuthData, switchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
