import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, TextInput, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Color } from '../../../Constant/Constants';
import { OrderHistory } from '../../../Constant/Api/Apiendpoint';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return Color.ligthYellows;
    case 'COMPLETED':
      return Color.lightGreen;
    default:
      return '#999';
  }
};

const PendingOrders = ({ data, navigation, onRefresh, refreshing }) => {
  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={data.filter(item => item.status === "PENDING").slice().reverse()}
        keyExtractor={(item) => item.Ordno.toString()}
        renderItem={({ item }) => <OrderItem item={item} navigation={navigation} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No Pending Orders</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.primeBlue]} />
        }

      />
    </View>
  );
};

const CompletedOrders = ({ data, navigation, onRefresh, refreshing }) => {
  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={data.filter(item => item.status === 'COMPLETED').slice().reverse()}
        keyExtractor={(item) => item.Ordno.toString()}
        renderItem={({ item }) => <OrderItem item={item} navigation={navigation} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No Completed Orders</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.primeBlue]} />
        }
      />
    </View>
  );
};

const OrderItem = ({ item, navigation }) => {
  const headerColor = getStatusColor(item.status);
  const backgroundColor = item.status === 'PENDING' ? '#fff5e6' : '#e6f9ed';
  const borderColor = item.status === 'PENDING' ? Color.ligthYellow : Color.lightGreen;
  const statusTextColor = item.status === 'COMPLETED' ? 'green' : Color.orange;
   console.log(item);
   
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor, borderColor, borderWidth: 1 }]}
      onPress={() => navigation.navigate('Invoice Details', { invoice: item })}
    >
      <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
        <Text style={styles.headerText}>Invoice: {item.vno}</Text>
        <Text style={[styles.statusText, { color: statusTextColor }]}>{item.status}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.leftSection}>
          <Text style={styles.dateText}>📅 Date: {moment(item.date).format('YYYY-MM-DD')}</Text>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
          <Text style={styles.itemCountText}>📦 Items: {item.count}</Text>
          <Text style={styles.itemCountText}>💰  Amount : {item.amt}</Text>
          </View>
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HistoryScreen = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
      const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

      const response = await OrderHistory(formattedStartDate, formattedEndDate);
      setInvoices(response);
    } catch (error) {
      console.error('Error fetching order history:', error);
      Alert.alert('Error', 'Failed to fetch order history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [startDate, endDate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrderHistory();
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Pending' },
    { key: 'completed', title: 'Completed' },
  ]);

  const renderScene = SceneMap({
    pending: () => <PendingOrders data={invoices} navigation={navigation} onRefresh={handleRefresh} refreshing={refreshing} />,
    completed: () => <CompletedOrders data={invoices} navigation={navigation} onRefresh={handleRefresh} refreshing={refreshing} />,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
        <Text style={styles.loadingText}>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <TextInput
            style={styles.dateInput}
            value={moment(startDate).format('YYYY-MM-DD')}
            editable={false}
          />
        </TouchableOpacity>
        <Text style={styles.datePickerSeparator}>to</Text>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <TextInput
            style={styles.dateInput}
            value={moment(endDate).format('YYYY-MM-DD')}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 360 }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicatorStyle}
            labelStyle={styles.labelStyle}
          />
        )}
      />
    </View>
  );
};

// Keep the same styles as in your original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: Color.primeBlue,
    elevation: 2,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "500"
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Color.primeBlue,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    textAlign: 'center',
    width: 160,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  datePickerSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  tabBar: {
    backgroundColor: Color.primeBlue,
    elevation: 0,
  },
  indicatorStyle: {
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 16,
    color: 'white',
  },
  cardContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: "center"
  },
  cardHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.primeBlue,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.orange,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  itemCountText: {
    fontSize: 14,
    color: '#555',
  },
});

export default HistoryScreen;