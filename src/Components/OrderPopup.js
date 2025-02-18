import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../Constant/Constants';
import { placeOrder } from '../Screens/Customer/OrderScreen/OrderApi';
import SuccessModal from './Successmodal';

// Utility function to format date and time
const formatDateTime = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return { formattedDate, formattedTime };
};

const BottomPopup = ({ visible, data, onClose, onConfirm, clearcart }) => {
  const [updatedData, setUpdatedData] = useState(data);
  const [userDiscount, setUserDiscount] = useState(null);
  const [userCode, setUserCode] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountValue, userCodeValue] = await Promise.all([
          AsyncStorage.getItem('userDiscount'),
          AsyncStorage.getItem('userCode'),
        ]);

        if (discountValue) setUserDiscount(parseFloat(discountValue));
        if (userCodeValue) setUserCode(userCodeValue);
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAmounts = () => {
    const total = updatedData.reduce(
      (sum, item) => sum + item.ptr * (item.userQty || 1),
      0
    );
    const discountAmount = (total * userDiscount) / 100;
    const finalAmount = total - discountAmount;
    return { total, discountAmount, finalAmount };
  };

  const { total, discountAmount, finalAmount } = calculateAmounts();

  const generatePayload = () => {
    const { formattedDate, formattedTime } = formatDateTime();

    const itemDetails = updatedData.map((product) => ({
      slcd: 'CL',
      acno: userCode,
      odt: formattedDate,
      itemc: product.code,
      qty: product.userQty,
      fqty: 0,
      Ordno: 1234,
      OrderDt: formattedDate,
      QtyRecd: 0,
      FQtyRecd: 0,
      Tag: 'N',
      PurVno: '0',
      PorderNo: '0',
      PorderDis: 0,
      Rate: product.ptr,
      Pacno: 0,
      Cst: '0',
      UID: 'JEAPP',
      mTime: formattedTime,
      Prate: 0,
      MRP: product.mrp,
      Remarks: '',
      Genmark: 'Y',
      DisPer: 0,
      Srate: product.ptr,
    }));

    const order = {
      OrdNo: '1234',
      Odt: formattedDate,
      Acno: userCode,
      SMan: '0',
      Tag: 'N',
      OrdType: 'JEAPP',
      mTime: formattedTime,
      FromSO: 'N',
      Amt: total.toFixed(2),
      DownloadDate: formattedDate,
      DayEndDate: formattedDate,
      CNTR: '0',
      MRCode: '0',
      PurVno: '0',
      CustOrdNo: '0',
    };

    return { itemDetails, order };
  };

  const handlePlaceOrder = async () => {
    const payload = generatePayload();
    setLoading(true); // Set loading to true when starting the order process
    try {
      const response = await placeOrder(payload);
      console.log(response.data);
      
      if (response?.status === 200) {
        setSuccessModalVisible(true);
        clearcart();
      } else {
        Alert.alert('Error', 'Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after the order process is complete
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.userQty}
        </Text>
        <Text style={styles.itemDetails}>
          {item.ptr}
        </Text>
        <Text style={styles.itemPrice}>
          ₹{(item.ptr * item.userQty).toFixed(2)}
        </Text>
      </View>

    </View>
  );

  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Order Summary</Text>
 
            <FlatList
              data={updatedData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={[styles.column, styles.itemName]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.column, styles.itemValue]}>
                    {item.userQty}
                  </Text>
                  <Text style={[styles.column, styles.itemValue]}>
                    {item.ptr.toFixed(2)}
                  </Text>
                  <Text style={[styles.column, styles.itemPrice]}>
                    ₹{(item.ptr * item.userQty).toFixed(2)}
                  </Text>
                </View>
              )}
              ListHeaderComponent={() => (
                <View style={styles.headerRow}>
                  <Text style={[styles.column, styles.headerText]}>Medicine</Text>
                  <Text style={[styles.column, styles.headerText]}>Qty</Text>
                  <Text style={[styles.column, styles.headerText]}>Ptr</Text>
                  <Text style={[styles.column, styles.headerText]}>Total Amt</Text>
                </View>
              )}
              contentContainerStyle={styles.listContainer}
            />


            <View style={styles.summaryContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>₹{total.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Discount ({userDiscount}%):</Text>
                <Text style={styles.value}>₹{discountAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Final Amount:</Text>
                <Text style={styles.totalValue}>₹{finalAmount.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePlaceOrder}
                style={styles.SubmitButton}
                disabled={loading} // Disable the button if loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" /> // Show loading indicator
                ) : (
                  <Text style={styles.SubmitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          onClose();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    height: '85%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,

  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemName: {

    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    alignItems: "center"
  },

  itemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    color: Color.primeBlue,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.green,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  SubmitButton: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: Color.primeBlue,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  SubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Color.green,
  },
  okButton: {
    backgroundColor: Color.primeBlue,
    padding: 10,
    borderRadius: 5,
  },
  okText: {
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  column: {
    flex: 1, // Makes each column take equal space
    textAlign: 'center', // Centers text within the column
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left', // Align medicine names to the left for readability
  },
  itemValue: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.primeBlue,
    textAlign: 'center',
  },
});

export default BottomPopup;
