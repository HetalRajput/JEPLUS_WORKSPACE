import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { GetHistory } from '../../../Constant/Api/DeliveyPersonaapis/History';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../../Constant/Constants';

const paymentIcons = {
  Cash: 'cash-outline',
  UPI: 'phone-portrait-outline',
  Cheque: 'document-text-outline',
  PayLater: 'time-outline',  // Icon for PayLater
  undelivered: 'close-circle-outline',  // Icon for Undeliver
  Approval:'checkmark-circle'
};

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [sdate, setSdate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const [edate, setEdate] = useState(moment().format('YYYY-MM-DD'));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null); // Track the selected payment method for filtering

  const calculateTotals = (data) => {
    return data.reduce(
      (totals, item) => {
        if (item.PayMethod === 'Cash') {
          totals.cash += item.PaidAmount;
        } else if (item.PayMethod === 'UPI') {
          totals.upi += item.PaidAmount;
        } else if (item.PayMethod === 'Cheque') {
          totals.cheque += item.PaidAmount;
        }
        return totals;
      },
      { cash: 0, upi: 0, cheque: 0 }
    );
  };

  const [totals, setTotals] = useState({ cash: 0, upi: 0, cheque: 0 });

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const response = await GetHistory(sdate, edate);
      const data = response.data;
 
      
      setHistoryData(data);
      setTotals(calculateTotals(data));
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing after data is fetched
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [sdate, edate]);

  const handleFilter = (method) => {
    if (selectedFilter === method) {
      // If the same filter is clicked again, reset the filter
      setSelectedFilter(null);
    } else {
      setSelectedFilter(method);
    }
  };

  const filteredData = selectedFilter
    ? historyData.filter((item) => item.PayMethod === selectedFilter)
    : historyData;

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true
    fetchHistoryData(); // Fetch the latest data
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1568ab" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
          {showStartDatePicker && (
        <DateTimePicker
          value={new Date(sdate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setSdate(moment(selectedDate).format('YYYY-MM-DD'));
            }
          }}
        />
      )}


      {showEndDatePicker && (
        <DateTimePicker
          value={new Date(edate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEdate(moment(selectedDate).format('YYYY-MM-DD'));
            }
          }}
        />
      )}
      {/* Header Cards */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 25, backgroundColor: Color.primeBlue }}>
        <TouchableOpacity style={styles.card} onPress={() => handleFilter('UPI')}>
          <Icon name="phone-portrait-outline" size={24} color="#fff" />
          <Text style={styles.cardTitle}>UPI Amount</Text>
          <Text style={styles.cardAmount}>₹ {totals.upi}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleFilter('Cheque')}>
          <Icon name="document-text-outline" size={24} color="#fff" />
          <Text style={styles.cardTitle}>Cheque Amount</Text>
          <Text style={styles.cardAmount}>₹ {totals.cheque}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleFilter('Cash','undelivered')}>
          <Icon name="cash-outline" size={24} color="#fff" />
          <Text style={styles.cardTitle}>Cash Amount</Text>
          <Text style={styles.cardAmount}>₹ {totals.cash}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Range and List */}
      <View style={{ paddingVertical: 10, flex: 1, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
            <Icon name="calendar-outline" size={20} color="#1568ab" />
            <Text style={styles.dateText}>{sdate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
            <Icon name="calendar-outline" size={20} color="#1568ab" />
            <Text style={styles.dateText}>{edate}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.Id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Bind the refreshing state
              onRefresh={onRefresh} // Bind the onRefresh function
              colors={[Color.primeBlue]} // Customize the refresh control colors
              tintColor={Color.primeBlue} // Customize the loading spinner color
            />
          }
          renderItem={({ item }) => (
            <LinearGradient
              colors={item.PayMethod === "undelivered" ? ['#ffebee', '#ffcdd2'] : ['#ffffff', '#e0f7fa']}
              style={styles.invoiceCard}
            >
              {/* Check if PayMethod is N/A */}
              {item.PayMethod === "undelivered" ? (
                // Render for the Undelivered case
                <>
                  <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceNumber}>Invoice: {item.Vno}</Text>
                  </View>

                  <Text style={styles.invoiceText}>Date: {item.TagDt}</Text>
                  <Text style={styles.invoiceText}>Time: {item.createdAt.slice(11,16)}</Text>

                  <View style={styles.undeliveredLabel}>
                    <Text style={styles.undeliveredText}>Undelivered</Text>
                  </View>

                  <View style={styles.amountContainer}>
                    <Text style={styles.totalText}>Total ₹ {item.VAmount}</Text>
                  </View>

                  {/* Collection Amount */}
                  <View style={styles.paymentMethodContainer}>
                    <Text style={styles.amountText}>Collection : ₹ {item.PaidAmount}</Text>
                  </View>

                  {/* Remarks (if available) */}
                  {item.remarks ? (
                    <Text style={styles.remarks}>Remarks: {item.remarks}</Text>
                  ) : null}
                </>
              ) : (
                // Render all details for non-N/A PayMethod
                <>
                  <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceNumber}>Invoice: {item.Vno}</Text>
                    <Icon name={paymentIcons[item.PayMethod] || 'help-outline'} size={24} color="#1568ab" />
                  </View>

                  <Text style={styles.invoiceText}>Date: {item.TagDt}</Text>
                  <Text style={styles.invoiceText}>Time: {item.createdAt.slice(11,16)}</Text>

                  <View style={styles.amountContainer}>
                    <Text style={styles.paymentMethodHighlight}>{item.PayMethod}</Text>
                    <View>
                    <Text style={styles.totalBalance}>Due: ₹ {item.VAmount-item.PaidAmount}</Text>
                    <Text style={styles.totalText}>Total: ₹ {item.VAmount}</Text>
                    </View>
               
                  </View>

                  <View style={styles.paymentMethodContainer}>
                    <Text style={styles.amountText}>Collection : ₹ {item.PaidAmount}</Text>
                  </View>

                  {item.remarks ? (
                    <Text style={styles.remarks}>Remarks: {item.remarks}</Text>
                  ) : null}
                </>
              )}
            </LinearGradient>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No history found !</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: "48%",
    marginTop: 5,
    borderWidth: 1,
    borderColor: Color.primeBlue,
    marginBottom: 10
  },
  dateText: {
    fontSize: 16,
    color: '#1568ab',
    fontWeight: '600',
    marginLeft: 8,
  },
  headerCardsContainer: {
    marginBottom: 16,
  },
  card: {
    alignItems: "center",
    paddingHorizontal:20
  },
  gradient: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    width: "100%"
  },
  cardTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  cardAmount: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  invoiceCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    margin: 5
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1568ab',
  },
  invoiceText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight:"600"
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.primeBlue,
    marginTop:10
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',

  },
  paymentMethodHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0288d1',
    marginLeft: 4,
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: '#e0f7fa',
    borderRadius: 4,
  },
  remarks: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1568ab',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  undeliveredLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#d32f2f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  undeliveredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalBalance:{
    fontSize: 16,
    fontWeight: '600',
    color: Color.red,
  },
  emptyContainer:{
    alignItems:"center"
  },
  emptyText:{
   fontSize:16,
   fontWeight:"600",
    
  }
});

export default HistoryScreen;