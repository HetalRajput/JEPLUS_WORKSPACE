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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Color } from "../../Constant/Constants";
import ImagePicker from "react-native-image-crop-picker";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";

export const CashPayCard = ({ selectedInvoices, navigation, totalOSAmount }) => {
  const totalAmount = totalOSAmount;

  const [amount, setAmount] = useState(totalAmount.toString());
  const [cashPhoto, setCashPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);

  useEffect(() => {
    const collectedAmount = parseFloat(amount) || 0;
    let remainingAmount = collectedAmount;

    const updatedPaymentStatus = selectedInvoices.map((invoice) => {
      if (remainingAmount <= 0) {
        return { ...invoice, status: "Unpaid", paidAmount: 0 };
      } else if (remainingAmount >= invoice.rawAmount) {
        remainingAmount -= invoice.rawAmount;
        return { ...invoice, status: "Paid", paidAmount: invoice.rawAmount };
      } else {
        const paidAmount = remainingAmount;
        remainingAmount = 0;
        return { ...invoice, status: "Partially Paid", paidAmount };
      }
    });

    setPaymentStatus(updatedPaymentStatus);
  }, [amount, selectedInvoices]);

  const handlePayment = async () => {
    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");

    if (missingFields.length > 0) {
      setMissingData(`Please fill the following data: ${missingFields.join(", ")}`);
      setErrorModalVisible(true);
      return;
    }

    setIsLoading(true);

    // Create the payload
    const payload = new FormData();

    // Add image as a file
    if (cashPhoto) {
      payload.append("image", {
        uri: cashPhoto,
        name: "cashPhoto.jpg", // Set a filename
        type: "image/jpeg", // Set the MIME type
      });
    }

    // Add lat and long as separate fields
    payload.append("lat", "28.2342434");
    payload.append("long", "78.2234234");

    // Add invoices as a JSON string
    payload.append(
      "data",
      JSON.stringify(
        paymentStatus.map((invoice) => ({
          vno: String(invoice.invoiceNo),
          tagno: String(invoice.tagNo),
          amount: String(invoice.paidAmount),
          paymethod: invoice.paymethod || "Cash",
          CollBoyRemarks: invoice.CollBoyRemarks || "success",
        }))
      )
    );

    try {
      // Simulate API call
      const response = await CollectionPay(payload);
      console.log(response);

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

  const pickImage = async (setPhoto) => {
    const options = {
      mediaType: "photo",
      quality: 0.5, // Reduce quality to 50%
      width: 1080,
      height: 1920,
      saveToPhotos: false,
      compressImageQuality: 0.5, // Compress image to 50% of original size
    };

    try {
      const image = await ImagePicker.openCamera(options);
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
        mediaType: "photo",
        compressImageQuality: 0.5, // Compress image to 50% of original size
      });

      const allowedFormats = ["jpg", "jpeg", "png"];
      const fileExtension = image.path.split(".").pop().toLowerCase();

      if (allowedFormats.includes(fileExtension)) {
        setPhoto(image.path);
      } else {
        console.warn("Invalid file format. Please select a JPEG or PNG image.");
      }
    } catch (error) {
      if (error.code === "E_PICKER_CANCELLED") {
        console.log("User cancelled image selection");
      } else {
        console.error("Error selecting image from gallery:", error.message);
      }
    }
  };

  const handleOk = () => {
    // Reset all states
    setAmount(totalAmount.toString());
    setCashPhoto(null);
    setPaymentStatus([]);
    setSuccessModal(false);

    // Navigate back to the previous screen
    navigation.navigate("CustomerMain");
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Cash Payment: ₹{totalAmount}</Text>
        <Text style={styles.description}>Collect cash from the customer.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Collected Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(value) => setAmount(value)}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.captureButton1, styles.flexButton]}
            onPress={() => pickImage(setCashPhoto)}
          >
            <Icon name="camera" size={20} color="black" />
            <Text> Capture Cash Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton2, { marginHorizontal: 0 }]}
            onPress={() => pickImageFromGallery(setCashPhoto)}
          >
            <Icon name="image" size={20} color="white" />
          </TouchableOpacity>
        </View>

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
                Amount: ₹{invoice.rawAmount.toFixed(2)}
              </Text>
              {invoice.status === "Partially Paid" && (
                <Text style={styles.invoiceText}>
                  Paid Amount: ₹{invoice.paidAmount.toFixed(2)}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      </View>

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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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