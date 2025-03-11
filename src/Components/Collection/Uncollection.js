import React, { useState } from "react";
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
import { getCurrentLocation } from "./GetCurrentlocarion";
import ImagePicker from "react-native-image-crop-picker";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";

export const UncollectionButton = ({ item, navigation, selectedInvoices }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const reasons = [
    "Customer not available",
    "Wrong address",
    "Product damaged",
    "Other reason",
  ];

  console.log("selected invoice >>>>>>>", selectedInvoices);

  const handleSubmitPayment = async () => {
    setIsModalVisible(false);
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();

      const payload = new FormData();

      // Add image as a file
      if (photo) {
        payload.append("image", {
          uri: photo,
          name: "undelivered_photo.jpg", // Set a filename
          type: "image/jpeg", // Set the MIME type
        });
      }

      // Add lat and long as separate fields
      payload.append("lat", String(location.latitude || "0.0"));
      payload.append("long", String(location.longitude || "0.0"));

      // Extract invoiceNo and tagNo from selectedInvoices
      const invoicesData = selectedInvoices.map((invoice) => ({
        vno: String(invoice.invoiceNo), // Use invoiceNo as vno
        tagno: String(invoice.tagNo), // Use tagNo as tagno
        amount: null, // Set amount to null as per requirement
        paymethod: "uncollected",
        CollBoyRemarks: selectedReason || "Item not collected",
      }));

      // Add invoices as a JSON string
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

  const capturePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      setPhoto(image.path);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  return (
    <View>
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
            <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
              <Text style={styles.photoButtonText}>
                {photo ? "Retake Photo" : "Capture Photo"}
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

      {/* Uncollected Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Uncollect</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reasonOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedOption: {
    backgroundColor: "#e0e0e0",
  },
  reasonText: {
    fontSize: 16,
  },
  photoButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
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
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },

});