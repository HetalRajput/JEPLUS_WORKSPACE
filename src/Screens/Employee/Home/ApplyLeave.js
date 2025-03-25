import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button } from 'react-native';
import { Color } from '../../../Constant/Constants';

const LeaveFormScreen = () => {

  const handleApplyLeave = () => {
    console.log('Leave applied!');
    // Add your API call or form submission logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
