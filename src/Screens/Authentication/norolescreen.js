import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../../Constant/Api/Authcontext';

const roleIcons = {
  ADMIN: 'user-shield',
  MANAGER: 'user-tie',
  EMPLOYEE: 'user',
  CUSTOMER: 'user-friends',
};

const RoleNotActiveScreen = () => {
  const { role, activeRole, switchProfile } = useAuth();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>This Role currently Not Active</Text>

      {role.map((r) => (
        <TouchableOpacity
          key={r}
          style={[styles.roleButton, activeRole === r && styles.activeRole]}
          onPress={() => switchProfile(r)}
          activeOpacity={0.7}
        >
          <Icon
            name={roleIcons[r] || 'user-circle'}
            size={20}
            color={activeRole === r ? '#fff' : '#007BFF'}
            style={styles.icon}
          />
          <Text style={[styles.roleText, activeRole === r && styles.activeText]}>
            {r}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginVertical: 8,
    width: '85%',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeRole: {
    backgroundColor: '#007BFF',
    elevation: 5,
    shadowOpacity: 0.3,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
  icon: {
    marginRight: 10,
  },
});

export default RoleNotActiveScreen;