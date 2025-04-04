import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';


export const CameraComponent = ({ onPhotoTaken, onClose }) => {
  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const camera = useRef(null);
  const device = useCameraDevice('back');

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto({
          flash: 'off',
          qualityPrioritization: 'quality',
        });
        setPhoto(photo);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1080,
        maxHeight: 1920,
      });

      if (!result.didCancel && !result.errorCode && result.assets?.[0]?.uri) {
        const selectedPhoto = {
          path: result.assets[0].uri,
          // For Android, we need to remove the 'file://' prefix if it exists
          path: Platform.OS === 'android' ? result.assets[0].uri.replace('file://', '') : result.assets[0].uri
        };
        setPhoto(selectedPhoto);
        setIsActive(false);
        setShowGallery(false);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const confirmPhoto = () => {
    onPhotoTaken(photo.path);
    onClose();
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsActive(true);
  };

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  if (device == null) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Camera not available</Text>
        <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
          <Icon name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  if (photo) {
    const photoUri = Platform.OS === 'android' ? photo.path : `file://${photo.path}`;
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
            <Icon name="camera-reverse" size={24} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={confirmPhoto}>
            <Icon name="checkmark-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.cameraContainer}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        
        {showGallery && (
          <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
            <Icon name="images" size={24} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.toggleGalleryButton} onPress={toggleGallery}>
          <Icon name={showGallery ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
  },
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
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  toggleGalleryButton: {
    padding: 10,
  },
});