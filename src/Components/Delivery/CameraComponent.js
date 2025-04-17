import React, { useRef } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';

export const CameraComponent = ({ 
  visible, 
  onClose, 
  onPhotoTaken, 
  photoType 
}) => {
  const device = useCameraDevice('back');
  const camera = useRef(null);

  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
          enableShutterSound: false,
        });

        const photoPath = Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;
        onPhotoTaken(photoPath, photoType);
        onClose();
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };

  if (!device) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.cameraWrapper}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={visible}
          photo={true}
        />

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cameraCloseButton}
            onPress={onClose}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cameraCaptureButton}
            onPress={takePhoto}
          >
            <View style={styles.captureInnerCircle} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraControls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraCloseButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  cameraCaptureButton: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  captureInnerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
});