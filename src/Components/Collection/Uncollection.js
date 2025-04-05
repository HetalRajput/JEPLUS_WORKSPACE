import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const { height, width } = Dimensions.get("window");

const CameraComponent = ({ onPhotoTaken, onClose }) => {
  const camera = useRef(null);
  const device = useCameraDevice('back');

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        onPhotoTaken(photo.path);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  if (!device) return <View style={styles.cameraErrorContainer}><Text>Camera device not found</Text></View>;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
        />
        <TouchableOpacity
          style={styles.closeCameraButton}
          onPress={onClose}
        >
          <Text style={styles.closeCameraText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const UncollectionButton = ({ navigation, selectedInvoices }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const reasons = [
    "Customer not available",
    "Shop Close",
    "Delay Payment",
    "Other reason",
  ];

  useEffect(() => {
    setSelectedReason(reasons[0]);
  }, []);

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  const handlePhotoTaken = (photoPath) => {
    setPhoto(photoPath);
    setShowCamera(false);
  };

  const handleSubmitPayment = async () => {
    closeModal();
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();

      const payload = new FormData();

      if (photo) {
        payload.append("image", {
          uri: 'file://' + photo,
          name: "undelivered_photo.jpg",
          type: "image/jpeg",
        });
      }

      payload.append("lat", String(location.latitude || "0.0"));
      payload.append("long", String(location.longitude || "0.0"));

      const invoicesData = selectedInvoices.map((invoice) => ({
        vno: String(invoice.invoiceNo),
        tagno: String(invoice.tagNo),
        amount: null,
        paymethod: "uncollected",
        CollBoyRemarks: selectedReason || "Item not collected",
      }));

      payload.append("data", JSON.stringify(invoicesData));

      const response = await CollectionPay(payload);

      if (response.success) {
        alert("Uncollected status submitted successfully.");
        navigation.navigate("CustomerMain");
      } else {
        alert("Failed to submit uncollected status.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to take photos');
        return false;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const capturePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
    }
  };

  if (showCamera) {
    return (
      <CameraComponent 
        onPhotoTaken={handlePhotoTaken} 
        onClose={() => setShowCamera(false)} 
      />
    );
  }

  return (
    <View>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalTitle}>Select Reason</Text>
            <ScrollView>
              {reasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
              <Text style={styles.photoButtonText}>
                {photo ? "Retake Photo" : "Capture Photo"}
              </Text>
            </TouchableOpacity>
            {photo && (
              <Image
                source={{ uri: 'file://' + photo }}
                style={styles.photoPreview}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSubmitPayment}
                disabled={!selectedReason || !photo}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={openModal}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Not collect</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  reasonOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#e0e0e0",
  },
  reasonText: {
    fontSize: 16,
  },
  photoButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  photoPreview: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#ddd',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCameraText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default UncollectionButton;