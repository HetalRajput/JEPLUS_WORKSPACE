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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RadioButton } from "react-native-paper";
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";
import { Picker } from '@react-native-picker/picker';

export const ApprovalCard = ({ item, navigation }) => {
  const [amount, setAmount] = useState(item.amount || "00");
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [cashPhoto, setCashPhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showReceivingButton, setShowReceivingButton] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");

  // New states for OTP functionality
  const [selectedPerson, setSelectedPerson] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Mock list of persons (replace with API data)
  const persons = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alice Johnson" },
  ];

  // Function to send OTP (mock implementation)
  const sendOtp = () => {
    if (!selectedPerson) {
      alert("Please select a person.");
      return;
    }
    // Simulate sending OTP (replace with API call)
    setOtpSent(true);
    alert(`OTP sent to ${selectedPerson}`);
  };

  // Function to verify OTP (mock implementation)
  const verifyOtp = () => {
    if (otp === "1234") {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");
    if (!invoicePhoto) missingFields.push("Cash Photo");
    if (!cashPhoto) missingFields.push("Invoice Photo");

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
      formData.append("remarks", "Approvel via",selectedPerson);
      formData.append("Lat", location.latitude || "0.0");
      formData.append("Long", location.longitude || "0.0");
      formData.append("image2", {});
      formData.append("image1", {});

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

  const resetState = () => {
    setAmount("");
    setInvoicePhoto(null);
    setCashPhoto(null);
    setSelectedReason("");
    setShowReasons(false);
    setShowReceivingButton(false);
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

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Approval: ₹{item.amount}</Text>
        <Text style={styles.description}>No need to collect amount.</Text>

        {/* Dropdown to select person */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Person:</Text>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => setSelectedPerson(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a person" value="" />
            {persons.map((person) => (
              <Picker.Item key={person.id} label={person.name} value={person.name} />
            ))}
          </Picker>
        </View>

        {/* Send OTP Button */}
        {!otpSent && (
          <TouchableOpacity style={styles.sendOtpButton} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}

        {/* OTP Input and Verify Button */}
        {otpSent && !otpVerified && (
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
        )}

        {/* Delivery Button */}
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

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={50} color={Color.green} />
            <Text style={styles.modalText}>Payment submitted successfully!</Text>
            <TouchableOpacity onPress={handleok} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={errorModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="warning" size={50} color={Color.red} />
            <Text style={styles.modalText}>{missingData}</Text>
            <TouchableOpacity onPress={handleErrorModalClose} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
});