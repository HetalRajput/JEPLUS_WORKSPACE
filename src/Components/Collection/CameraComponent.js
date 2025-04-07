import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';

export const CameraComponent = ({ onCapture, onClose }) => {
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [isActive, setIsActive] = useState(true);

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          flash: 'off',
          skipMetadata: true,
          enableShutterSound: false,
          quality: 0.9, // Lower quality to further reduce size
          maxWidth: 800,
          maxHeight: 1200,
          pixelFormat: 'yuv',
        });
        
        
        // Format URI properly for both platforms
        const photoUri = Platform.OS === 'android' ? `file://${photo.path}` : photo.path;
        
        onCapture(photoUri);
        onClose();
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      onClose();
    }
  };

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Camera device not available</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
        orientation="portrait"
        photoQualityBalance="balanced" // Balance between quality and performance
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});