import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Color } from '../../../Constant/Constants';

const LeaveFormScreen = () => {

  const handleApplyLeave = () => {
    console.log('Leave applied!');
    // Add your API call or form submission logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Leave Count Section */}
      <View style={styles.leaveCountContainer}>
        <View style={styles.leaveCard}>
          <Text style={styles.leaveTitle}>EL</Text>
          <Text style={styles.leaveCount}>12</Text>
          <Text style={styles.leaveLabel}>Earned Leave</Text>
        </View>
        <View style={styles.leaveCard}>
          <Text style={styles.leaveTitle}>CL</Text>
          <Text style={styles.leaveCount}>8</Text>
          <Text style={styles.leaveLabel}>Casual Leave</Text>
        </View>
        <View style={styles.leaveCard}>
          <Text style={styles.leaveTitle}>ML</Text>
          <Text style={styles.leaveCount}>5</Text>
          <Text style={styles.leaveLabel}>Medical Leave</Text>
        </View>
      </View>

      <Text style={styles.header}>Leave Application Form</Text>
      <Text style={styles.subHeader}>Please provide information about your leave.</Text>

      {/* Leave Type */}
      <Text style={styles.label}>Leave Type</Text>
      <TextInput 
        placeholder="Choose leave type..." 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {/* Subject */}
      <Text style={styles.label}>Subject</Text>
      <TextInput 
        placeholder="Enter subject..." 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {/* Select Date */}
      <Text style={styles.label}>Select Date</Text>
      <TextInput 
        placeholder="Select leave date..." 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {/* Select Period */}
      <Text style={styles.label}>Select Period</Text>
      <TextInput 
        placeholder="Period of leave..." 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput 
        placeholder="Enter reason..." 
        style={[styles.input, styles.textarea]} 
        multiline 
        placeholderTextColor="#888"
      />

      {/* Upload Section */}
      <Text style={styles.label}>Upload File</Text>
      <View style={styles.uploadContainer}>
        <TextInput 
          placeholder="Pdf, Png, Jpg files" 
          style={styles.uploadInput} 
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs Will Be Covered By */}
      <Text style={styles.label}>Jobs Will Be Covered By</Text>
      <TextInput 
        placeholder="Who will cover your work..." 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {/* Apply Leave Button */}
      <TouchableOpacity style={styles.button} onPress={handleApplyLeave}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

export default LeaveFormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  leaveCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leaveCard: {
    flex: 1,
    backgroundColor: "white", 
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Color.primeBlue,
 
  },
  leaveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.primary,
  },
  leaveCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  leaveLabel: {
    fontSize: 12,
    color: '#555',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Color.primary,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    color: '#333',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  uploadButton: {
    backgroundColor: Color.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
