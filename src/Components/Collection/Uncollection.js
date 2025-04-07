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
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";
import { useIsFocused } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

export const UncollectionButton = ({ navigation, selectedInvoices }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const camera = useRef(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');

  const reasons = [
    "Customer not available",
    "Shop Close",
    "Delay Payment",
    "Other reason",
  ];

  useEffect(() => {
    setSelectedReason(reasons[0]);
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      let granted;
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status = await Camera.requestCameraPermission();
        setHasCameraPermission(status === 'authorized');
      }
    } catch (err) {
      console.warn("Camera permission error:", err);
      setHasCameraPermission(false);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setShowCamera(false);
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  const handleSubmitPayment = async () => {
    if (!photo) {
      Alert.alert("Error", "Please capture a photo first");
      return;
    }
    
    closeModal();
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();

      const payload = new FormData();
      payload.append("image", {
        uri: photo,
        name: "undelivered_photo.jpg",
        type: "image/jpeg",
      });
      payload.append("lat", String(location.latitude || "0.0"));
      payload.append("long", String(location.longitude || "0.0"));

      const invoicesData = selectedInvoices.map((invoice) => ({
        vno: String(invoice.invoiceNo),
        tagno: String(invoice.tagNo),
        amount: null,
        paymethod: "Not_Collected",
        CollBoyRemarks: selectedReason || "Item not collected",
      }));

      payload.append("data", JSON.stringify(invoicesData));

      const response = await CollectionPay(payload);

      if (response.success) {
        Alert.alert("Success", "Uncollected status submitted successfully.");
        navigation.navigate("CustomerMain");
      } else {
        Alert.alert("Error", "Failed to submit uncollected status.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      if (camera.current == null) {
        throw new Error("Camera not ready");
      }
      
      const file = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        enableAutoStabilization: true,
        skipMetadata: true,
      });
      
      setPhoto(`file://${file.path}`);
      setShowCamera(false);
    } catch (error) {
      console.error("Failed to take photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const capturePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert(
        "Permission Required", 
        "Camera permission is needed to take photos",
        [
          { text: "Cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }
    
    if (!device) {
      Alert.alert("Error", "No camera device found");
      return;
    }
    
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <View>
      {/* Camera View */}
      {showCamera && hasCameraPermission && device && (
        <Modal
          visible={showCamera}
          transparent={false}
          animationType="slide"
          onRequestClose={closeCamera}
        >
          <View style={styles.cameraContainer}>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isFocused && showCamera}
              photo={true}
            />
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={closeCamera}
              >
                <Text style={styles.closeCameraText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Reason Selection Modal */}
      <Modal
        visible={isModalVisible && !showCamera}
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
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={capturePhoto}
              disabled={!hasCameraPermission}
            >
              <Text style={styles.photoButtonText}>
                {photo ? "Retake Photo" : "Capture Photo"}
              </Text>
            </TouchableOpacity>
            {photo && (
              <Image
                source={{ uri: photo }}
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

      {/* Main Button */}
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
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'white',
  },
  closeCameraButton: {
    position: 'absolute',
    right: 20,
    top: 20,
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
});

export default UncollectionButton;