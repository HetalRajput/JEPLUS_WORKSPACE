import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RadioButton } from "react-native-paper";
import ImagePicker from "react-native-image-crop-picker";
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";

export const ChequePayCard = ({ item, navigation }) => {
  const [amount, setAmount] = useState(item.amount || "00");
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [cashPhoto, setCashPhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showReceivingButton, setShowReceivingButton] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false); // State for error modal
  const [missingData, setMissingData] = useState(""); // State to store missing data message

  const handlePayment = async () => {
    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");
    if (!invoicePhoto) missingFields.push("Invoice Photo");
    if (!cashPhoto) missingFields.push("Cash Photo");

    if (missingFields.length > 0) {
      setMissingData(`Please fill the following data: ${missingFields.join(", ")}`);
      setErrorModalVisible(true); // Show error modal
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
      formData.append("PaidAmount", amount);
      formData.append("PayMethod", "Cheque");
      formData.append("DelStatus", "Delivered");
      formData.append("remarks", selectedReason || "All Payment collected successfully");
      formData.append("Lat", location.latitude || "0.0");
      formData.append("Long", location.longitude || "0.0");

      if (cashPhoto) {
        formData.append("image2", {
          uri: cashPhoto,
          type: "image/jpeg",
          name: "cash_payment.jpg",
        });
      }

      if (invoicePhoto) {
        formData.append("image1", {
          uri: invoicePhoto,
          type: "image/jpeg",
          name: "invoice_payment.jpg",
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

  const pickImage = async (setPhoto) => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      setPhoto(image.path);
      setShowReceivingButton(true);
    } catch (error) {
      console.error("Error selecting image:", error.message);
    }
  };

  const resetState = () => {
    setAmount("");
    setInvoicePhoto(null);
    setCashPhoto(null);
    setSelectedReason("");
    setShowReasons(false);
    setShowReceivingButton(false);
  };

  const handleok = () => {
    setSuccessModal(false);
    navigation.navigate("Map");
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false); // Close error modal
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Cheque Payment: ₹{item.amount}</Text>
        <Text style={styles.description}>Collect Cheque from the customer.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Collected Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(value) => {
            setAmount(value);
            setShowReasons(value && parseFloat(value) < item.amount);
          }}
        />

        {showReasons && (
          <View style={styles.radioContainer}>
            <Text style={styles.reasonTitle}>Select a reason for less amount:</Text>
            <RadioButton.Group onValueChange={setSelectedReason} value={selectedReason}>
              <View style={styles.radioItem}>
                <RadioButton value="less_cash" />
                <Text>Customer gave less Cheque</Text>
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

        {/* Capture Cash Photo Button */}
        <TouchableOpacity
          style={styles.captureButton1}
          onPress={() => pickImage(setInvoicePhoto)}
        >
          <Icon name="camera" size={20} color="black" />
          <Text> Capture Cheque Photo</Text>
        </TouchableOpacity>

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

        {/* Capture Receiving Photo Button (Conditionally Rendered) */}
        {showReceivingButton && (
          <>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(setCashPhoto)}
            >
              <Icon name="camera" size={20} color="white" />
              <Text style={{ color: "white" }}> Capture Receiving Photo</Text>
            </TouchableOpacity>

            {cashPhoto && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: cashPhoto }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCashPhoto(null)}
                >
                  <Icon name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <View style={styles.undeliveredButton}>
            <UndeliveredButton item={item} navigation={navigation} />
          </View>

          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Delivered</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
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
  radioLabel: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
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
    borderWidth: 1,
    borderColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText1: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  icon: {
    marginRight: 5,
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
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
  imageContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
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
});