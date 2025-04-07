import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";
import { Picker } from '@react-native-picker/picker';
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import { Sendotp } from "../../Constant/Api/DeliveyPersonaapis/Mapendpoint";
import { Verifyotp } from "../../Constant/Api/DeliveyPersonaapis/Mapendpoint";

// Reusable Components (keep these the same as before)
const Dropdown = ({ label, selectedValue, onValueChange, items, disabled }) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
      enabled={!disabled}
    >
      <Picker.Item label="Select a person" value="" />
      {items.map((item) => (
        <Picker.Item key={item.id} label={item.name} value={item.name} />
      ))}
    </Picker>
  </View>
);

const OTPInput = ({ otp, setOtp, verifyOtp }) => (
  <View style={styles.otpContainer}>
    <TextInput
      style={styles.otpInput}
      placeholder="Enter OTP"
      value={otp}
      onChangeText={setOtp}
      keyboardType="numeric"
    />
    <TouchableOpacity style={styles.verifyOtpButton} onPress={verifyOtp}>
      <Text style={styles.buttonText}>Verify OTP</Text>
    </TouchableOpacity>
  </View>
);

const ImagePickerButton = ({ onPress, iconName, label, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Icon name={iconName} size={20} color={Color.primeBlue} />
    {label && <Text style={{ color: "white" }}> {label}</Text>}
  </TouchableOpacity>
);

const SuccessModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Icon name="checkmark-circle" size={50} color={Color.green} />
        <Text style={styles.modalText}>Payment submitted successfully!</Text>
        <TouchableOpacity onPress={onClose} style={styles.okButton}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const ErrorModal = ({ visible, message, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Icon name="warning" size={50} color={Color.red} />
        <Text style={styles.modalText}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.okButton}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const CameraModal = ({ visible, onClose, onPhotoTaken }) => {
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        await Camera.requestCameraPermission();
      }
      setShowCamera(true);
    };
    checkCameraPermission();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        onPhotoTaken(`file://${photo.path}`);
        onClose();
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.cameraModalContainer}>
        {device && showCamera && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={visible}
            photo={true}
          />
        )}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeCameraButton} onPress={onClose}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ApprovalCard = ({ item, navigation }) => {
  const [amount, setAmount] = useState(item.amount || "00");
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const persons = [
    { id: "2", name: "ROHIT JHA" },
    { id: "3", name: "BHOLA MISHRA" }
  ];

  const sendOtp = async() => {
    if (!selectedPerson) {
      Alert.alert("Error", "Please select a person.");
      return;
    }
    
    const response = await Sendotp(item.acno,selectedPerson);
    
    if (response.success) {
      Alert.alert("Success", `OTP sent to ${selectedPerson}`)
      setOtpSent(true);
      return;
    }
    else{
      Alert.alert("Error", "Failed to send OTP. Please try again.",response.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await Verifyotp(item.acno, otp);
  
      if (response.success) {
        setOtpVerified(true);
        setDisabled(true);
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!otpVerified) {
      Alert.alert("Error", "Please verify OTP first.");
      return;
    }

    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");
    if (!invoicePhoto) missingFields.push("Cash Photo");

    if (missingFields.length > 0) {
      setMissingData(`Please fill the following data: ${missingFields.join(", ")}`);
      setErrorModalVisible(true);
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
      formData.append("PayMethod", "Approval");
      formData.append("DelStatus", "Delivered");
      formData.append("remarks", "Approval successfully");  
      formData.append("Lat", location.latitude || "0.0");
      formData.append("Long", location.longitude || "0.0");
      if (invoicePhoto) {
        formData.append("image2", {
          uri: invoicePhoto,
          type: "image/jpeg",
          name: "invoice_payment.jpg",
        });
      }

      const response = await Pay(formData);
    
      if (response) {
        setSuccessModal(true);
        resetState();
      } else {
        Alert.alert("Error", "Failed to submit payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setAmount("");
    setInvoicePhoto(null);
    setSelectedReason("");
    setShowReasons(false);
    setSelectedPerson("");
    setOtpSent(false);
    setOtp("");
    setOtpVerified(false);
  };

  const handleok = () => {
    setSuccessModal(false);
    navigation.navigate("Map");
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setInvoicePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting from gallery:", error);
      Alert.alert("Error", "Failed to select image from gallery");
    }
  };

  const handlePhotoTaken = (photoUri) => {
    setInvoicePhoto(photoUri);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Approval: ₹{item.amount}</Text>
        <Text style={styles.description}>No need to collect amount.</Text>

        <Dropdown
          label="Select Person:"
          selectedValue={selectedPerson}
          onValueChange={setSelectedPerson}
          items={persons}
          disabled={otpVerified}
        />

        {!otpSent && (
          <TouchableOpacity style={styles.sendOtpButton} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}

        {otpSent && !otpVerified && (
          <OTPInput otp={otp} setOtp={setOtp} verifyOtp={verifyOtp} />
        )}

        <View style={styles.buttonRow}>
          <ImagePickerButton
            onPress={() => setShowCameraModal(true)}
            iconName="camera"
            label="Capture Invoice Photo"
            style={[styles.captureButton1, styles.flexButton, styles.buttonText]}
          />
          <ImagePickerButton
            onPress={pickImageFromGallery}
            iconName="image"
            style={styles.captureButton2}
          />
        </View>

        {invoicePhoto && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: invoicePhoto }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInvoicePhoto(null)}
            >
              <Icon name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.undeliveredButton}>
            <UndeliveredButton item={item} navigation={navigation} />
          </View>

          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={handlePayment}
            disabled={isLoading || !otpVerified}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.DeliveredText}>Delivered</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <CameraModal
        visible={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onPhotoTaken={handlePhotoTaken}
      />

      <SuccessModal visible={successModal} onClose={handleok} />
      <ErrorModal visible={errorModalVisible} message={missingData} onClose={handleErrorModalClose} />
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: '#f8f9fa', // Light background for the container
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
    marginVertical: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0', // subtle border
  },
  cameraModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  closeCameraButton: {
    position: 'absolute',
    top: 50,
    right: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2c3e50",
  },
  description: {
    fontSize: 15,
    color: "#7f8c8d",
    marginBottom: 20,
    lineHeight: 22,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  picker: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  sendOtpButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Color.primeBlue,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#ffffff",
    marginRight: 12,
    color: '#2c3e50',
  },
  verifyOtpButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#3498db',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  undeliveredButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 16,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  deliveredButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  DeliveredText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: '100%',
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  modalText: {
    fontSize: 17,
    marginVertical: 16,
    color: "#2c3e50",
    textAlign: 'center',
    lineHeight: 24,
  },
  okButton: {
    backgroundColor: Color.primeBlue,
    paddingHorizontal: 32,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: Color.primeBlue,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: '600',

  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Color.primeBlue,
    backgroundColor: Color.primeBlue,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Color.primeBlue,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    justifyContent:"center"
  },
  buttonRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
    backgroundColor: Color.primeBlue,
    marginBottom: 16,
    shadowColor: Color.primeBlue,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  flexButton: {
    flex: 1,
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  captureButton1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.primeBlue,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: Color.primeBlue,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  captureButton2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Color.primeBlue,
    paddingVertical: 5,
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});