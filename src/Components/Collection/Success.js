import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure this is installed and linked properly
import { Color } from '../../Constant/Constants';

const SuccessModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.successOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={60} color={Color.green} />
          </View>
          <Text style={styles.successText}>Order Placed Successfully!</Text>
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '80%',
    elevation: 10, // For shadow effect on Android
    shadowColor: '#000', // For shadow effect on iOS
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconContainer: {
    marginBottom: 15,
    borderWidth:1,
    borderRadius:35,
    borderColor:Color.green,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    elevation: 3,
  },
  okText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessModal;
