import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RadioButton } from "react-native-paper";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";

export const PayLaterCard = ({ item, navigation }) => {
  const [receivingPhoto, setReceivingPhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  
  // Camera states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      if (permission !== 'granted') {
        const newPermission = await Camera.requestCameraPermission();
        setCameraPermission(newPermission === 'granted');
      } else {
        setCameraPermission(true);
      }
    };
    checkCameraPermission();
  }, []);

  const handlePayment = async () => {
    if (!receivingPhoto) {
      setErrorModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const formData = new FormData();

      formData.append("Vno", item.id);
      formData.append("Acno", item.acno);
      formData.append("TagDt", item.date);
      formData.append("SMan", item.sman);
      formData.append("VAmount", item.amount);
      formData.append("PaidAmount", "0");
      formData.append("PayMethod", "PayLater");
      formData.append("DelStatus", "Delivered");
      formData.append("remarks", selectedReason || "Pay Later successfully");
      formData.append("Lat", location.latitude || "0.0");
      formData.append("Long", location.longitude || "0.0");

      if (receivingPhoto) {
        formData.append("image2", {
          uri: receivingPhoto,
          type: "image/jpeg",
          name: "receiving_payment.jpg",
        });
      }

      const response = await Pay(formData);

      if (response.success) {
        setSuccessModal(true);
        resetState();
      } else {
        alert("Failed to submit payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
          enableShutterSound: false,
        });
        setReceivingPhoto(`file://${photo.path}`);
        setShowCameraModal(false);
      } catch (error) {
        console.error("Error taking photo:", error);
        alert("Failed to capture photo. Please try again.");
      }
    }
  };

  const resetState = () => {
    setReceivingPhoto(null);
    setSelectedReason("");
    setShowReasons(false);
  };

  const handleOk = () => {
    setSuccessModal(false);
    navigation.navigate("Map");
  };

  const renderCameraModal = () => (
    <Modal
      visible={showCameraModal}
      transparent={false}
      animationType="slide"
      onRequestClose={() => setShowCameraModal(false)}
    >
      <View style={styles.cameraContainer}>
        {device && (
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCameraModal}
            photo={true}
          />
        )}
        
        <View style={styles.cameraHeader}>
          <TouchableOpacity 
            style={styles.closeCameraButton}
            onPress={() => setShowCameraModal(false)}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cameraFooter}>
          <TouchableOpacity 
            style={styles.captureButtonCamera} 
            onPress={takePhoto}
          >
            <View style={styles.captureInnerCircle} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Pay Later Amount: ₹{item.amount}</Text>

        {showReasons && (
          <View style={styles.radioContainer}>
            <Text style={styles.reasonTitle}>Select a reason for less amount:</Text>
            <RadioButton.Group onValueChange={setSelectedReason} value={selectedReason}>
              <View style={styles.radioItem}>
                <RadioButton value="less_cash" />
                <Text>Customer gave less cash</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="discount" />
                <Text>Discount given by company</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="other" />
                <Text>Other reason</Text>
              </View>
            </RadioButton.Group>
          </View>
        )}

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={() => {
            if (!cameraPermission) {
              alert("Camera permission is required to capture photos");
              return;
            }
            setShowCameraModal(true);
          }}
          disabled={!cameraPermission}
        >
          <Icon name="camera" size={20} color="white" />
          <Text style={{ color: "white" }}> Capture Receiving Photo</Text>
        </TouchableOpacity>

        {receivingPhoto && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: receivingPhoto }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setReceivingPhoto(null)}
            >
              <Icon name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.undeliveredButton}>
            <UndeliveredButton item={item} navigation={navigation}/>
          </View>
          <TouchableOpacity 
            style={styles.deliveredButton} 
            onPress={handlePayment} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Delivered</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Modal */}
      {renderCameraModal()}

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={50} color={Color.green} />
            <Text style={styles.modalText}>Payment submitted successfully!</Text>
            <TouchableOpacity onPress={handleOk} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal for missing photo */}
      <Modal visible={errorModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="warning" size={50} color={Color.red} />
            <Text style={styles.modalText}>Please capture a receiving photo before submitting.</Text>
            <TouchableOpacity onPress={() => setErrorModal(false)} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deliveredButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  undeliveredButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  okButton: {
    backgroundColor: Color.primeBlue,
    paddingHorizontal: 50,
    borderRadius: 8,
    paddingVertical: 10,
  },
  okButtonText: {
    color: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  closeCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  captureButtonCamera: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  radioContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});