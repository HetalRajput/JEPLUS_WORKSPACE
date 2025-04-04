import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Color } from "../../Constant/Constants";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";
import { RadioButton } from "react-native-paper";
import { launchImageLibrary } from 'react-native-image-picker';
import { CameraComponent } from "./CameraComponent";

export const UpiPayCard  = ({ selectedInvoices, navigation, totalOSAmount, tagNo, acno }) => {
  const totalAmount = totalOSAmount;

  const [amount, setAmount] = useState(totalAmount.toString());
  const [cashPhoto, setCashPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState(" ");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const collectedAmount = parseFloat(amount) || 0;
    let remainingAmount = collectedAmount;
  
    const updatedPaymentStatus = selectedInvoices.map((invoice) => {
      if (remainingAmount <= 0) {
        return { ...invoice, status: "Unpaid", paidAmount: 0 };
      } else if (remainingAmount >= invoice.ostAmt) {
        remainingAmount -= invoice.ostAmt;
        return { ...invoice, status: "Paid", paidAmount: invoice.ostAmt };
      } else {
        const paidAmount = remainingAmount;
        remainingAmount = 0;
        return { ...invoice, status: "Partially Paid", paidAmount };
      }
    });
  
    setPaymentStatus(updatedPaymentStatus);
  }, [amount, selectedInvoices]);

  const pickImageFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 1080,
        maxHeight: 1920,
      });
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setCashPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
    }
  };

  const handleCameraCapture = (uri) => {
    setCashPhoto(uri);
    setIsCameraOpen(false);
  };

  const handlePayment = async () => {
    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");
    if (showReasons && !selectedReason) {
      setMissingData("Please select a reason for the lesser amount.");
      setErrorModalVisible(true);
      return;
    }
    if (!cashPhoto) {
      setMissingData("Please capture the UPI image for a reason.");
      setErrorModalVisible(true);
      return;
    }
    if (missingFields.length > 0) {
      setMissingData(`Please fill the following data: ${missingFields.join(", ")}`);
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    const payload = new FormData();
    if (cashPhoto) {
      payload.append("image", {
        uri: cashPhoto,
        name: "cashPhoto.jpg",
        type: "image/jpeg",
      });
    }

    payload.append("lat", "28.2342434");
    payload.append("long", "78.2234234");
    payload.append(
      "data",
      JSON.stringify(
        paymentStatus.map((invoice) => ({
          vno: String(invoice.invoiceNo),
          tagno: String(invoice.tagNo),
          amount: String(invoice.paidAmount),
          paymethod: "UPI",
          CollBoyRemarks: selectedReason || "success",
        }))
      )
    );

    try {
      console.log(">>>>>",payload);
      
      const response = await CollectionPay(payload);
      if (response.success) {
        setSuccessModal(true);
      } else {
        throw new Error("Failed to submit payment");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      setMissingData("Failed to submit payment. Please try again.");
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = () => {
    setAmount(totalAmount.toString());
    setCashPhoto(null);
    setPaymentStatus([]);
    setSuccessModal(false);
    setShowReasons(false);
    setSelectedReason("");
    navigation.navigate("Invoices", { tagNo, acno });
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>UPI Payment: ₹{totalAmount}</Text>
        <Text style={styles.description}>Collect UPI from the customer.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Collected Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(value) => {
            setAmount(value);
            setShowReasons(value && parseFloat(value) < totalOSAmount);
          }}
        />
        
        {showReasons && (
          <View style={styles.radioContainer}>
            <Text style={styles.reasonTitle}>Select a reason for less amount:</Text>
            <RadioButton.Group onValueChange={setSelectedReason} value={selectedReason}>
              <View style={styles.radioItem}>
                <RadioButton value="less_UPI" />
                <Text>Customer gave less UPI</Text>
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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.captureButton1, styles.flexButton]}
            onPress={() => setIsCameraOpen(true)}
          >
            <Icon name="camera" size={20} color="black" />
            <Text> Capture UPI Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.captureButton2]}
            onPress={pickImageFromGallery}
          >
            <Icon name="image" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {cashPhoto && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: cashPhoto }} 
              style={styles.previewImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCashPhoto(null)}
            >
              <Icon name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.paymentButton} 
          onPress={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.paymentText}>Submit Payment</Text>
          )}
        </TouchableOpacity>

        <View style={styles.paymentStatusContainer}>
          <Text style={styles.paymentStatusTitle}>Payment Status:</Text>
          {paymentStatus.map((invoice, index) => (
            <View key={index} style={styles.invoiceStatusCard}>
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceText}>
                  Invoice: {invoice.invoiceNo}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    invoice.status === "Paid" && styles.paidBadge,
                    invoice.status === "Partially Paid" && styles.partialBadge,
                    invoice.status === "Unpaid" && styles.unpaidBadge,
                  ]}
                >
                  <Text style={styles.statusText}>{invoice.status}</Text>
                </View>
              </View>
              <Text style={styles.invoiceText}>
                Amount: ₹{invoice.ostAmt.toFixed(2)}
              </Text>
              {invoice.status === "Partially Paid" && (
                <Text style={styles.invoiceText}>
                  Paid Amount: ₹{invoice.paidAmount.toFixed(2)}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={isCameraOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCameraOpen(false)}
      >
        <CameraComponent 
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      </Modal>

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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.primeBlue,
    marginBottom: 10,
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
    backgroundColor: Color.primeBlue,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  flexButton: {
    flex: 1,
  },
  paymentButton: {
    backgroundColor: Color.primeBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  paymentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  paymentStatusContainer: {
    marginTop: 20,
  },
  paymentStatusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  invoiceStatusCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  invoiceText: {
    fontSize: 14,
    color: "#444",
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  paidBadge: {
    backgroundColor: "#2ecc71",
  },
  partialBadge: {
    backgroundColor: "#f1c40f",
  },
  unpaidBadge: {
    backgroundColor: "#e74c3c",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});