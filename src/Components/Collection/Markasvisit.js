import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Markasvisit } from "../../Constant/Api/Collectionapi/Apiendpoint";

const MarkAsVisitPopup = ({ visible, onClose, invoiceData,navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (invoiceData) {
      setLoading(true); // Show loader

      const tagNo = invoiceData.tagno;
      const acNo = invoiceData.acno;
      const body = { Tagno: tagNo, acno: acNo };

      try {
        const response = await Markasvisit(body);
        if(response.status==200){
          onClose(); // Close modal after API call
          navigation.navigate("Invoices", {
            tagNo: tagNo,
            acno: acNo,
          })

        }
      } catch (error) {
        console.error("Error in Markasvisit API:", error);
      } finally {
        setLoading(false); // Hide loader after API call
      }
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Mark as Visited</Text>
          
          <Text style={styles.description}>
            Are you sure you want to mark <Text style={styles.boldText}>{invoiceData?.name}</Text> as visited?
          </Text>

          <Text style={styles.note}>
            ⚠️ <Text style={styles.noteText}>Note:</Text> You need to be near this medical shop.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.disabledButton]} 
              onPress={handleConfirm} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
    color: "#1568ab",
  },
  note: {
    fontSize: 14,
    color: "#d9534f",
    marginBottom: 20,
    textAlign: "center",
  },
  noteText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#1568ab",
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MarkAsVisitPopup;
