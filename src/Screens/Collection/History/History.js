import React, { useState } from 'react';
import { 
    View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions 
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Color } from '../../../Constant/Constants';

const CollectionHistory = () => {
    const [collectionData, setCollectionData] = useState([
        { id: '1', date: '2023-10-01', amount: 1500, status: 'COLLECTED' },
        { id: '2', date: '2023-10-02', amount: 2000, status: 'UNCOLLECTED' },
        { id: '3', date: '2023-10-03', amount: 3000, status: 'COLLECTED' },
    ]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardDate}>📅 {item.date}</Text>
            <Text style={styles.cardAmount}>💰 ${item.amount}</Text>
            <Text style={[styles.cardStatus, { color: item.status === 'COLLECTED' ? '#4CAF50' : '#FFA000' }]}>
                {item.status}
            </Text>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={collectionData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No Collection History</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const OrderHistory = () => {
    const [orderData, setOrderData] = useState([
        { id: '1', date: '2023-10-01', items: 5, amount: 500, status: 'COMPLETED' },
        { id: '2', date: '2023-10-02', items: 3, amount: 300, status: 'UNCOLLECTED' },
        { id: '3', date: '2023-10-03', items: 2, amount: 200, status: 'COMPLETED' },
    ]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardDate}>📅 {item.date}</Text>
            <Text style={styles.cardAmount}>📦 {item.items} Items</Text>
            <Text style={styles.cardAmount}>💰 ${item.amount}</Text>
            <Text style={[styles.cardStatus, { color: item.status === 'COMPLETED' ? '#4CAF50' : '#FFA000' }]}>
                {item.status}
            </Text>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={orderData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No Order History</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const CollectionHistoryScreen = () => {
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'collection', title: 'Collection History' },
        { key: 'order', title: 'Order History' },
    ]);

    const renderScene = SceneMap({
        collection: CollectionHistory,
        order: OrderHistory,
    });

    return (
        <View style={styles.container}>
            {/* Date Picker Section */}
            <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInputContainer}>
                    <TextInput
                        style={styles.dateInput}
                        value={moment(startDate).format('YYYY-MM-DD')}
                        editable={false}
                        placeholder="Start Date"
                    />
                </TouchableOpacity>
                <Text style={styles.dateSeparator}>to</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInputContainer}>
                    <TextInput
                        style={styles.dateInput}
                        value={moment(endDate).format('YYYY-MM-DD')}
                        editable={false}
                        placeholder="End Date"
                    />
                </TouchableOpacity>
            </View>

            {/* Date Pickers */}
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

            {/* TabView */}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}  // FIX APPLIED HERE
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={styles.tabBar}
                        indicatorStyle={styles.indicator}
                        labelStyle={styles.tabLabel}
                        activeColor="#6200EE"
                        inactiveColor="#757575"
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
  },
  datePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      
    },
  dateInputContainer: {
      flex: 1,
      marginHorizontal: 8,
  },
  dateInput: {
      borderWidth: 1,
      borderColor: Color.primeBlue,
      borderRadius: 8,
      padding: 12,
      textAlign: 'center',
      backgroundColor: '#fff',
      fontSize: 16,
  },
  dateSeparator: {
      fontSize: 16,
      color: '#757575',
      marginHorizontal: 8,
  },
  tabContainer: {
      flex: 1,
     
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      margin:5
  },
  cardDate: {
      fontSize: 16,
      color: '#333',
      marginBottom: 8,
  },
  cardAmount: {
      fontSize: 14,
      color: '#555',
      marginBottom: 4,
  },
  cardStatus: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 8,
  },
  emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#757575',
      marginTop: 20,
  },
  tabBar: {
      backgroundColor: '#fff',
      elevation: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
  },
  indicator: {
      backgroundColor: '#6200EE',
      height: 3,
  },
  tabLabel: {
      fontSize: 14,
      fontWeight: 'bold',
  },
});

export default CollectionHistoryScreen;
