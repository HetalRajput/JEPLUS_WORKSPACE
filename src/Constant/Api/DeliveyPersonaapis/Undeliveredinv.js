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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation } from "../../../Components/Delivery/GetCurrentlocarion";
import ImagePicker from "react-native-image-crop-picker";

export const UndeliveredButton = ({ item, navigation }) => {
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

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token !== null) {
        return token;
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      throw error;
    }
  };

  const handleSubmitPayment = async () => {
    setIsModalVisible(false);
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const token = await getToken();

      const formData = new FormData();
      formData.append("Vno", String(item.id));
      formData.append("Acno", String(item.acno));
      formData.append("TagDt", String(item.date));
      formData.append("SMan", String(item.sman));
      formData.append("VAmount", String(item.amount));
      formData.append("PaidAmount", "0");
      formData.append("PayMethod", "undelivered");
      formData.append("DelStatus", "Failed");
      formData.append("remark", selectedReason || "Item not delivered");
      formData.append("Lat", String(location.latitude || "0.0"));
      formData.append("Long", String(location.longitude || "0.0"));

      if (photo) {
        formData.append("image1", {
          uri: photo,
          type: "image/jpeg",
          name: "undelivered_photo.jpg",
        });
      }

      const response = await axios.post("http://jemapps.in/api/delivery/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        alert("Undelivered status submitted successfully.");
        navigation.navigate("Map");
      } else {
        alert("Failed to submit undelivered status.");
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

      {/* Undelivered Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Undelivered</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
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
    borderBottomColor: "#ddd",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOption: {
    backgroundColor: "#FF5733",
  },
  photoButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF5733",
    borderRadius: 8,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  photoPreview: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#FF5733",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UndeliveredButton;
