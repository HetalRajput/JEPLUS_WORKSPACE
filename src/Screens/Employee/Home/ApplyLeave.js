import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Color } from '../../../Constant/Constants';
import { ApplyLeave } from '../../../Constant/Api/EmployeeApi/Apiendpoint';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

const LeaveFormScreen = ({ route }) => {
  const { remainingLeaves } = route.params || {};
  console.log("This is remaining leave", remainingLeaves);

  // Form states
  const [leaveType, setLeaveType] = useState('EL');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [image, setImage] = useState(null);
  
  // Date states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // UI states
  const [showLeaveTypePicker, setShowLeaveTypePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyLeave = async () => {
    if (!leaveType || !subject || !reason) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    if (startDate > endDate) {
      Alert.alert("Validation", "End date cannot be before start date.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      formData.append('leaveType', leaveType);
      formData.append('subject', subject);
      formData.append('reason', reason);
      formData.append('startDate', startDate.toISOString().split('T')[0]);
      formData.append('endDate', endDate.toISOString().split('T')[0]);
      
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `supporting_file_${Date.now()}.jpg`
        });
      }

      const response = await ApplyLeave(formData);
      console.log('Leave Applied Response:', response);
      Alert.alert("Success", "Leave applied successfully!");
      
      // Reset form
      setSubject('');
      setReason('');
      setImage(null);
    } catch (error) {
      console.error('Error applying leave:', error);
      Alert.alert("Error", "Failed to apply leave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setImage({
          uri: source.uri,
          type: source.type,
          fileName: source.fileName
        });
      }
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Remaining Leaves Display - Read Only */}
      <View style={styles.remainingLeavesContainer}>
        <View style={styles.leaveCountBox}>
          <Text style={styles.leaveCountLabel}>Casual Leave (CL)</Text>
          <Text style={styles.leaveCountValue}>{remainingLeaves?.[0]?.remainingCL}</Text>
          <Text style={styles.leaveCountSubtext}>Remaining</Text>
        </View>
        
        <View style={styles.leaveCountBox}>
          <Text style={styles.leaveCountLabel}>LWP</Text>
          <Text style={styles.leaveCountValue}>{remainingLeaves?.[0]?.remainingLWP}</Text>
          <Text style={styles.leaveCountSubtext}>Remaining</Text>
        </View>
      </View>

      <Text style={styles.header}>Leave Application Form</Text>
      <Text style={styles.subHeader}>Please provide information about your leave.</Text>

      {/* Leave Type */}
      <Text style={styles.label}>Leave Type*</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowLeaveTypePicker(true)}
      >
        <Text>{leaveType === 'EL' ? 'Earned Leave' : 
               leaveType === 'CL' ? 'Casual Leave' : 
               'Medical Leave'}</Text>
      </TouchableOpacity>

      {/* Leave Type Picker Modal */}
      <Modal
        visible={showLeaveTypePicker}
        transparent={true}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setShowLeaveTypePicker(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContent}>
          <Picker
            selectedValue={leaveType}
            onValueChange={(itemValue) => {
              setLeaveType(itemValue);
              setShowLeaveTypePicker(false);
            }}
          >
            <Picker.Item label="Earned Leave (EL)" value="EL" />
            <Picker.Item label="Casual Leave (CL)" value="CL" />
            <Picker.Item label="Medical Leave (ML)" value="ML" />
          </Picker>
        </View>
      </Modal>

      {/* Subject */}
      <Text style={styles.label}>Subject*</Text>
      <TextInput 
        placeholder="Enter subject..." 
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholderTextColor="#888"
      />

      {/* Date Selection */}
      <View style={styles.dateRow}>
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Start Date*</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{formatDate(startDate)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.label}>End Date*</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      {/* Reason */}
      <Text style={styles.label}>Reason*</Text>
      <TextInput 
        placeholder="Enter reason for leave..." 
        style={[styles.input, styles.textarea]} 
        multiline 
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
        placeholderTextColor="#888"
      />

      {/* Image Upload */}
      <Text style={styles.label}>Supporting Document (Required)</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>Choose File</Text>
      </TouchableOpacity>
      
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: image.uri }} 
            style={styles.imagePreview}
          />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setImage(null)}
          >
            <Text style={styles.removeImageText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleApplyLeave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Leave Application</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 40,
  },
  remainingLeavesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  leaveCountBox: {
    alignItems: 'center',
    flex: 1,
  },
  leaveCountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  leaveCountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.primary,
  },
  leaveCountSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
    justifyContent: 'center',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    width: '48%',
  },
  uploadButton: {
    backgroundColor: Color.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: Color.primeBlue,
  },
  uploadText: {
    color: Color.primeBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imagePreviewContainer: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: 30,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 28,
  },
});

export default LeaveFormScreen;