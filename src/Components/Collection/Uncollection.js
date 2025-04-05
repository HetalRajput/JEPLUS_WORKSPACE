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
} from "react-native";
import { getCurrentLocation } from "./GetCurrentlocarion";
import ImagePicker from "react-native-image-crop-picker";
import { CollectionPay } from "../../Constant/Api/Collectionapi/Apiendpoint";
import { CameraComponent } from "./CameraComponent";
const { height, width } = Dimensions.get("window");

export const UncollectionButton = ({ navigation, selectedInvoices }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current; // Start from bottom

  const reasons = [
    "Customer not available",
    "Shop Close",
    "Delay Payment",
    "Other reason",
  ];

  // Set the first reason as default when the component mounts
  useEffect(() => {
    setSelectedReason(reasons[0]);
  }, []);

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide up to the top
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Slide down to the bottom
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  const handleSubmitPayment = async () => {
    closeModal();
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
            <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
              <Text style={styles.photoButtonText}>
                {photo ? "Retake Photo" : "Capture Photo"}
              </Text>
            </TouchableOpacity>
            {photo && (
              <Image
                source={{ uri: photo }}
                style={styles.photoPreview} // Increased image size
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

      {/* Uncollected Button */}
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
    maxHeight: height * 0.8, // Limit height to 80% of the screen
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
    width: width * 0.8, // 80% of screen width
    height: width * 0.8, // Square image with same width and height
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