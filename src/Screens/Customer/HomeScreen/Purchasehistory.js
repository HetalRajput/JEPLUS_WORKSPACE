import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Color } from '../../../Constant/Constants';
import { Purchasehistory } from '../../../Constant/Api/Apiendpoint';
import InvoiceDownloadButton from '../../../Components/DownloadInvoice';
import NoInternetPopup from '../../../Components/Nointernetpopup';
const PurchaseHistoryScreen = ({ navigation }) => {
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(new Date().getDate() - 7);
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);

    setStartDate(formattedSevenDaysAgo);
    setEndDate(today);
    fetchPurchaseHistory(formattedSevenDaysAgo, today);
  }, []);

  const fetchPurchaseHistory = async (start, end) => {
    try {
      setLoading(true);
      const response = await Purchasehistory(start, end);
      console.log(response);
      
      setFilteredData(response || []);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setStartDatePickerVisible(false);
    if (selectedDate) {
      const currentDate = selectedDate.toISOString().slice(0, 10);
      setStartDate(currentDate);
      fetchPurchaseHistory(currentDate, endDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setEndDatePickerVisible(false);
    if (selectedDate) {
      const currentDate = selectedDate.toISOString().slice(0, 10);
      setEndDate(currentDate);
      fetchPurchaseHistory(startDate, currentDate);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.purchaseItem}>
      <View style={styles.cardHeader}>
        <View style={styles.iconTextContainer}>
          <Text style={[styles.icon, { color: Color.primeBlue }]}>📄</Text>
          <Text style={styles.itemText}>Invoice No: {item.InvNo}</Text>
        </View>
      </View>
      <View style={styles.iconTextContainer}>
        <Text style={[styles.icon, { color: '#999' }]}>📅</Text>
        <Text style={styles.itemText}>
          Date: {new Date(item.Vdt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.iconTextContainer}>
        <Text style={[styles.icon, { color: '#999' }]}>💰</Text>
        <Text style={styles.amountText}>Amount: ₹{item.Amt}</Text>
      </View>
      <InvoiceDownloadButton pdfUrl={item.url} />
    </View>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <NoInternetPopup/>
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity
          onPress={() => setStartDatePickerVisible(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>Start Date: {startDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEndDatePickerVisible(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>End Date: {endDate}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} />
      ) : (
        <FlatList
          data={[...filteredData].reverse()} // Reversing the list
          renderItem={renderItem}
          keyExtractor={(item) => item.InvNo.toString()}
        />

      )}

      {isStartDatePickerVisible && (
        <DateTimePicker
          value={new Date(startDate)}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {isEndDatePickerVisible && (
        <DateTimePicker
          value={new Date(endDate)}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  dateRangeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  dateButton: {
    backgroundColor: Color.lightGray,
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
  },
  dateButtonText: { fontSize: 16, color: '#333' },
  purchaseItem: {
    backgroundColor: '#ffffff', // White background for card
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth:.7,
    borderColor:Color.lightGreen
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  badge: {
    backgroundColor: '#4caf50',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  itemText: { fontSize: 16, color: '#333', marginBottom: 4 },
  amountText: { fontSize: 18, fontWeight: '700', color: Color.primeBlue },
  iconTextContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { marginRight: 8, fontSize: 16, color: '#777' },
});


export default PurchaseHistoryScreen;