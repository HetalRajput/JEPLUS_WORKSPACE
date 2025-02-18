import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetPopup = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsConnected(false);
        setModalVisible(true);
      } else {
        setIsConnected(true);
        setModalVisible(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Modal
      transparent
      visible={!isConnected && modalVisible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.message}>
            Please check your internet connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NoInternetPopup;
