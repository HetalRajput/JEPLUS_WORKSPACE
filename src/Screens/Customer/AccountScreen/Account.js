import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const AccountScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the  Screen3!</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default AccountScreen;
