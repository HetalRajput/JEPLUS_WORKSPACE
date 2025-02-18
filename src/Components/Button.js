import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export const PrimaryButton = ({ title, onPress }) => {
  return (
    
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
   


  )
}
const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  button: {
    width: '90%',
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#051525',
  },
  signupButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})