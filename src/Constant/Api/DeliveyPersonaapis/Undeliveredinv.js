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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation } from "../../../Components/Delivery/GetCurrentlocarion";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";

export const UndeliveredButton = ({ item, navigation }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');

  const reasons = [
    "Customer not available",
    "Wrong address",
    "Product damaged",
    "Other reason",
  ];

  useEffect(() => {
    const checkCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        await Camera.requestCameraPermission();
      }
    };
    checkCameraPermission();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token !== null) {
        return token;
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      throw error;
    }
  };

  const handleSubmitPayment = async () => {
    setIsModalVisible(false);
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const token = await getToken();

      const formData = new FormData();
      formData.append("Vno", String(item.id));
      formData.append("Acno", String(item.acno));
      formData.append("TagDt", String(item.date));
      formData.append("SMan", String(item.sman));
      formData.append("VAmount", String(item.amount));
      formData.append("PaidAmount", "0");
      formData.append("PayMethod", "undelivered");
      formData.append("DelStatus", "Failed");
      formData.append("remark", selectedReason || "Item not delivered");
      formData.append("Lat", String(location.latitude || "0.0"));
      formData.append("Long", String(location.longitude || "0.0"));

      if (photo) {
        formData.append("image2", {
          uri: photo,
          type: "image/jpeg",
          name: "undelivered_photo.jpg",
        });
      }

      const response = await axios.post("http://jemapps.in/api/delivery/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        alert("Undelivered status submitted successfully.");
        navigation.navigate("Map");
      } else {
        alert("Failed to submit undelivered status.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        setPhoto(`file://${photo.path}`);
        setShowCamera(false);
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };



  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <View>
      {/* Camera View */}
      {showCamera && device && (
        <Modal
          visible={showCamera}
          transparent
          animationType="slide"
          onRequestClose={closeCamera}
        >
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={showCamera}
              photo={true}
            />
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for reason selection, photo capture, and confirmation */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonText}>
                {photo ? "Retake Photo" : "Take Photo"}
              </Text>
            </TouchableOpacity>
            {photo && (
              <Image source={{ uri: photo }} style={styles.photoPreview} />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
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
          </View>
        </View>
      </Modal>

      {/* Undelivered Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Undelivered</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // Your button styles
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
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
    borderBottomColor: "#ddd",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "#FF5733",
  },
  photoButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF5733",
    borderRadius: 8,
    alignItems: "center",
  },
  galleryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  photoPreview: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#FF5733",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UndeliveredButton;