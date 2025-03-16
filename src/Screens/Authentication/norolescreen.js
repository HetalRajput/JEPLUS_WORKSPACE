import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../Constant/Api/Authcontext';

const RoleNotActiveScreen = () => {
  const { logout } = useAuth(); // Assuming your useAuth hook provides a logout function

  return (
    <View style={styles.container}>
      <Text style={styles.message}>This role is not active.</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#1568ab',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RoleNotActiveScreen;