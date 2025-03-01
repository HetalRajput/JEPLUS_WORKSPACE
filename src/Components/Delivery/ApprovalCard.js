import React, { useState } from "react";
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
import { RadioButton } from "react-native-paper";
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";
import { Picker } from '@react-native-picker/picker';
import ImagePicker from "react-native-image-crop-picker";

// Reusable Components
const Dropdown = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
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

export const ApprovalCard = ({ item, navigation }) => {
  const [amount, setAmount] = useState(item.amount || "00");
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");

  const [selectedPerson, setSelectedPerson] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const persons = [
    { id: "1", name: "MUKESH JHA " },
    { id: "2", name: "ROHIT JHA" },
    { id: "3", name: "BHOLA MISHRA" },
    { id: "4", name: "JAVED RASHID" }
  ];

  const sendOtp = () => {
    if (!selectedPerson) {
      Alert.alert("Error", "Please select a person.");
      return;
    }
    setOtpSent(true);
    Alert.alert("Success", `OTP sent to ${selectedPerson}`);
  };

  const verifyOtp = () => {
    if (otp === "1234") {
      setOtpVerified(true);
      Alert.alert("Success", "OTP verified successfully!");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
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
      console.log(location);

      const formData = new FormData();
      formData.append("Vno", item.id);
      formData.append("Acno", item.acno);
      formData.append("TagDt", item.date);
      formData.append("SMan", item.sman);
      formData.append("VAmount", item.amount);
      formData.append("PaidAmount", amount);
      formData.append("PayMethod", "Approvel");
      formData.append("DelStatus", "Delivered");
      formData.append("remarks", "Approvel via", selectedPerson);
      formData.append("Lat", location.latitude || "0.0");
      formData.append("Long", location.longitude || "0.0");
      if (invoicePhoto) {
        formData.append("image2", {
          uri: invoicePhoto,
          type: "image/jpeg",
          name: "invoice_payment.jpg",
        });
      }
      formData.append("image1", {});

      const response = await Pay(formData);

      if (response.success) {
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

  const pickImage = async (setPhoto) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
      });
      setPhoto(image.path);
    } catch (error) {
      console.error("Error selecting image:", error.message);
    }
  };

  const pickImageFromGallery = async (setPhoto) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: 'photo',
      });
      const allowedFormats = ['jpg', 'jpeg', 'png'];
      const fileExtension = image.path.split('.').pop().toLowerCase();
      if (allowedFormats.includes(fileExtension)) {
        setPhoto(image.path);
      } else {
        Alert.alert("Error", "Invalid file format. Please select a JPEG or PNG image.");
      }
    } catch (error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log("User cancelled image selection");
      } else {
        console.error("Error selecting image from gallery:", error.message);
      }
    }
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
            onPress={() => pickImage(setInvoicePhoto)}
            iconName="camera"
            label="Capture Invoice Photo"
            style={[styles.captureButton1, styles.flexButton,styles.buttonText]}
          />
          <ImagePickerButton
            onPress={() => pickImageFromGallery(setInvoicePhoto)}
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
              <Text style={styles.buttonText}>Delivered</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <SuccessModal visible={successModal} onClose={handleok} />
      <ErrorModal visible={errorModalVisible} message={missingData} onClose={handleErrorModalClose} />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
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
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  sendOtpButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },
  verifyOtpButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  undeliveredButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  deliveredButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
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
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth:1,
    borderColor:Color.primeBlue,
    backgroundColor: Color.primeBlue,
    marginBottom: 10
  },
  buttonRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor:Color.primeBlue,
    marginBottom: 10
  },
  flexButton: {
    flex: 1,

  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  captureButton1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Color.primeBlue,
    paddingVertical: 12,
  },
  captureButton2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Color.primeBlue,
    paddingVertical: 12,
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 9
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
  },
});