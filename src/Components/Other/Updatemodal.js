import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Circle, G } from 'react-native-svg';

const UpdateModal = ({ 
  visible, 
  isMandatory, 
  releaseNotes, 
  onUpdate, 
  onCancel,
  downloadProgress = 0,
}) => {
  const radius = 40;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = circleCircumference - (circleCircumference * downloadProgress) / 100;
  const downloadComplete = downloadProgress >= 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={isMandatory && !downloadComplete ? null : onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon name="system-update" size={50} color="#4CAF50" style={styles.icon} />
          <Text style={styles.title}>
            {downloadComplete ? 'Update Downloaded!' : 'New Update Available'}
          </Text>
          
          {releaseNotes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>What's New:</Text>
              <Text style={styles.notesText}>{releaseNotes}</Text>
            </View>
          )}

          {/* Circular Progress - Only show if not complete */}
          {!downloadComplete && (
            <View style={styles.progressContainer}>
              <Svg height="120" width="120" viewBox="0 0 120 120">
                <G rotation="-90" origin="60, 60">
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#e0e0e0"
                    fill="transparent"
                    strokeWidth="10"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#4CAF50"
                    fill="transparent"
                    strokeWidth="10"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{`${Math.round(downloadProgress)}%`}</Text>
              </View>
            </View>
          )}

          {/* Show success icon when download is complete */}
          {downloadComplete && (
            <View style={styles.successContainer}>
              <Icon name="check-circle" size={60} color="#4CAF50" />
              <Text style={styles.successText}>Ready to install!</Text>
            </View>
          )}

          {/* Button logic */}
          {downloadComplete ? (
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          ) : downloadProgress > 0 ? (
            <Text style={styles.downloadingText}>Downloading update...</Text>
          ) : (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
                <Text style={styles.buttonText}>Update Now</Text>
              </TouchableOpacity>
              {!isMandatory && (
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Later</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  notesContainer: {
    marginBottom: 20,
    width: '100%',
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    textAlign: 'left',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#666',
  },
  progressContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  downloadingText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
});

export default UpdateModal;