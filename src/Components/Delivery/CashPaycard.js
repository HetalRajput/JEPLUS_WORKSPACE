import React, { useState, useRef, useEffect } from "react";
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
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RadioButton } from "react-native-paper";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { Color } from "../../Constant/Constants";
import { Pay } from "../../Constant/Api/DeliveyPersonaapis/Delivered";
import { getCurrentLocation } from "./GetCurrentlocarion";
import { UndeliveredButton } from "../../Constant/Api/DeliveyPersonaapis/Undeliveredinv";

export const CashPayCard = ({ item, navigation }) => {
  // Calculate total amount from all invoices
  const totalAmount = item.invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
  const [amount, setAmount] = useState(totalAmount.toString());
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [cashPhoto, setCashPhoto] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showReceivingButton, setShowReceivingButton] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [missingData, setMissingData] = useState("");
  const [distributedAmounts, setDistributedAmounts] = useState(
    item.invoices.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount,
      collected: invoice.amount
    }))
  );

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState(null);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        await Camera.requestCameraPermission();
      }
    };
    checkPermissions();
  }, []);

  const handleAmountChange = (value) => {
    setAmount(value);
    const collected = parseFloat(value) || 0;
    setShowReasons(collected < totalAmount);
    
    // Distribute amount proportionally
    if (collected > 0) {
      const newDistributedAmounts = distributedAmounts.map(inv => {
        const ratio = parseFloat(inv.amount) / totalAmount;
        return {
          ...inv,
          collected: (collected * ratio).toFixed(2)
        };
      });
      setDistributedAmounts(newDistributedAmounts);
    }
  };

  const handlePayment = async () => {
    const missingFields = [];
    if (!amount) missingFields.push("Collected Amount");
    if (!invoicePhoto) missingFields.push("Invoice Photo");
    if (!cashPhoto) missingFields.push("Cash Photo");
  
    if (missingFields.length > 0) {
      setMissingData(`Please fill: ${missingFields.join(", ")}`);
      setErrorModalVisible(true);
      return;
    }
  
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
  
      // Prepare invoice data array
      const invoiceData = item.invoices.map(invoice => {
        const distAmount = distributedAmounts.find(d => d.id === invoice.id);
        return {
          Vno: invoice.id,
          Acno: invoice.acno,
          TagDt: invoice.date,
          SMan: invoice.sman,
          VAmount: invoice.amount,
          PaidAmount: distAmount?.collected || invoice.amount,
          PayMethod: "Cash",
          DelStatus: "Delivered",
          remarks: selectedReason || "Payment collected",
          Lat: location.latitude || "0.0",
          Long: location.longitude || "0.0"
        };
      });
  
      // Create FormData
      const formData = new FormData();
      
      // 1. Add JSON data as plain text
      formData.append('data', JSON.stringify(invoiceData));
      
      // 2. Add images properly
      const addImage = (uri, fieldName) => {
        formData.append(fieldName, {
          uri,
          type: 'image/jpeg',
          name: `${fieldName}_${Date.now()}.jpg`
        });
      };
  
      if (invoicePhoto) addImage(invoicePhoto, 'image1');
      if (cashPhoto) addImage(cashPhoto, 'image2');
  
      // Debug output
      console.log('FormData contents:', {
        data: invoiceData,
        image1: invoicePhoto ? 'exists' : 'none',
        image2: cashPhoto ? 'exists' : 'none'
      });
  
      // Make API call
      const response = await Pay(formData)
  
      if (response.data.success) {
        setSuccessModal(true);
        resetState();
      } else {
        alert(response.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const takePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
          enableShutterSound: false,
        });

        const photoPath = Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;

        if (currentPhotoType === 'invoice') {
          setInvoicePhoto(photoPath);
        } else if (currentPhotoType === 'cash') {
          setCashPhoto(photoPath);
        }

        setShowCamera(false);
        setShowReceivingButton(true);
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };

  const openCamera = (photoType) => {
    setCurrentPhotoType(photoType);
    setShowCamera(true);
  };

  const pickImageFromGallery = async (photoType) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        mediaType: 'photo',
      });

      const allowedFormats = ['jpg', 'jpeg', 'png'];
      const fileExtension = image.path.split('.').pop().toLowerCase();

      if (allowedFormats.includes(fileExtension)) {
        if (photoType === 'invoice') {
          setInvoicePhoto(image.path);
        } else {
          setCashPhoto(image.path);
        }
        setShowReceivingButton(true);
      } else {
        console.warn("Invalid file format. Please select a JPEG or PNG image.");
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error("Error selecting image from gallery:", error.message);
      }
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
    setErrorModalVisible(false);
  };

  if (showCamera && device) {
    return (
      <Modal visible={showCamera && device != null} animationType="slide" transparent={false}>
        <View style={styles.cameraWrapper}>
          {device && (
            <Camera
              ref={camera}
              style={styles.cameraView}
              device={device}
              isActive={true}
              photo={true}
            />
          )}

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraCloseButton}
              onPress={() => setShowCamera(false)}
            >
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraCaptureButton}
              onPress={takePhoto}
            >
              <View style={styles.captureInnerCircle} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Cash Payment: ₹{totalAmount}</Text>
        <Text style={styles.description}>Collect cash from the customer.</Text>
        <Text style={styles.subtitle}>Invoices to deliver:</Text>
        
        {item.invoices.map((invoice, index) => (
          <View key={invoice.id} style={styles.invoiceItem}>
            <Text style={styles.invoiceText}>Invoice #{invoice.id}</Text>
            <Text style={styles.invoiceText}>Amount: ₹{invoice.amount}</Text>
            {showReasons && (
              <TextInput
                style={styles.distributedInput}
                value={distributedAmounts.find(d => d.id === invoice.id)?.collected || invoice.amount}
                onChangeText={(value) => {
                  const newDistributedAmounts = [...distributedAmounts];
                  const index = newDistributedAmounts.findIndex(d => d.id === invoice.id);
                  if (index !== -1) {
                    newDistributedAmounts[index].collected = value;
                    setDistributedAmounts(newDistributedAmounts);
                    // Update total amount
                    setAmount(
                      newDistributedAmounts.reduce((sum, inv) => sum + parseFloat(inv.collected || 0), 0).toFixed(2)
                    );
                  }
                }}
                keyboardType="numeric"
              />
            )}
          </View>
        ))}

        <TextInput
          style={styles.input}
          placeholder="Enter Total Collected Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={handleAmountChange}
        />

        {showReasons && (
          <View style={styles.radioContainer}>
            <Text style={styles.reasonTitle}>Select a reason for less amount:</Text>
            <RadioButton.Group onValueChange={setSelectedReason} value={selectedReason}>
              <View style={styles.radioItem}>
                <RadioButton value="less_cash" />
                <Text>Customer gave less cash</Text>
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
            onPress={() => openCamera('invoice')}
          >
            <Icon name="camera" size={20} color="black" />
            <Text> Capture Cash Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton2}
            onPress={() => pickImageFromGallery('invoice')}
          >
            <Icon name="image" size={20} color="white" />
          </TouchableOpacity>
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

        {showReceivingButton && (
          <>
            <View style={styles.buttonRow1}>
              <TouchableOpacity
                style={[styles.captureButton1, styles.flexButton, { backgroundColor: Color.primeBlue }]}
                onPress={() => openCamera('cash')}
              >
                <Icon name="camera" size={20} color="white" />
                <Text style={{ color: "white" }}> Capture Invoice Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureButton2, { backgroundColor: "white", borderWidth: 1, borderColor: Color.primeBlue }]}
                onPress={() => pickImageFromGallery('cash')}
              >
                <Icon name="image" size={20} color={Color.primeBlue} />
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
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Deliver All</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle" size={50} color={Color.green} />
            <Text style={styles.modalText}>All invoices submitted successfully!</Text>
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
    paddingBottom: 20,
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
  cameraWrapper: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cameraView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  distributedInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    width: '100%',
  },
  invoiceItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  invoiceText: {
    fontSize: 14,
  },
  cameraCloseButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
  },
  
  cameraCaptureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'gray',
  },
  
  captureInnerCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.primeBlue,
    marginBottom: 10,
    overflow: 'hidden',
  },
  buttonRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: Color.primeBlue,
    marginBottom: 10,
    overflow: 'hidden',
  },
  flexButton: {
    flex: 1,
  },
  captureButton1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  captureButton2: {
    padding: 12,
    backgroundColor: Color.primeBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
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
    padding: 5,
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: Color.primeBlue,
    paddingHorizontal: 50,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 15,
  },
  okButtonText: {
    color: "white",
    fontWeight: 'bold',
  },
  // Camera styles
  cameraControls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraCloseButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  cameraCaptureButton: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  captureInnerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
});