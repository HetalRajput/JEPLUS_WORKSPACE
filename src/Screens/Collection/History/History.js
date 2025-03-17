import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, RefreshControl, ActivityIndicator
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Color } from '../../../Constant/Constants';
import { GetCollectionhistory, GetCollectionOrderHistory } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import CollectionHistoryCard from '../../../Components/Collection/Historycard';

// Constants
const { width } = Dimensions.get('window');

// Collection History Component
const CollectionHistory = ({ startDate, endDate }) => {
    const [collectionData, setCollectionData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCollection = useCallback(async () => {
        try {
            setRefreshing(true);
            setLoading(true);
            const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

            const response = await GetCollectionhistory(formattedStartDate, formattedEndDate);
            if (response.success) {
                const formattedData = response.data.map(item => ({
                    id: item.VNo.toString(),
                    date: item.CollectedDate,
                    amount: item.Amt,
                    status: item.PayMethod === 'Cash' ? 'COLLECTED' : 'UNCOLLECTED',
                    billNo: item.BillNo,
                    name: item.Name,
                    invoiceNo: item.VNo,
                    CollectedAmount: item.CollectedAmount
                }));
                setCollectionData(formattedData);
            } else {
                setError('Failed to fetch collection history.');
            }
        } catch (err) {
            setError('An error occurred while fetching data.');
            console.error("Error fetching collection history:", err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchCollection();
    }, [fetchCollection]);

    const onRefresh = () => {
        fetchCollection();
    };

    const renderItem = ({ item }) => (
        <CollectionHistoryCard item={item} />
    );

    if (loading) {
        return <ActivityIndicator size="large" color={Color.primeBlue} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={collectionData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No Collection History</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Color.primeBlue]}
                    />
                }
            />
        </View>
    );
};

// Order History Component
const OrderHistory = ({ orderData }) => {
    console.log(orderData);
    
    const [refreshing, setRefreshing] = useState(false);

    const formattedOrderData = useMemo(() => {
        return orderData.map(item => ({
            id: item.Ordno.toString(),
            date: moment(item.Odt).format('YYYY-MM-DD'),
            items: item.order_count,
            amount: item.amt,
            status: item.order_status,
            name:item.name
        }));
    }, [orderData]);

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
    };

    const renderItem = ({ item }) => (
    
        <View style={styles.card}>
            <Text style={styles.name}># {item.name}</Text>
            <Text style={styles.cardDate}>📅 {item.date}</Text>
            <Text style={styles.cardAmount}>📦 {item.items} Items</Text>
            <Text style={styles.cardAmount}>💰 ₹{item.amount}</Text>
            <Text style={[styles.cardStatus, { color: item.status === 'COMPLETED' ? '#4CAF50' : '#FFA000' }]}>
                {item.status}
            </Text>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={formattedOrderData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No Order History</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Color.primeBlue]}
                    />
                }
            />
        </View>
    );
};

// Main Screen Component
const CollectionHistoryScreen = () => {
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [index, setIndex] = useState(0);
    const [orderData, setOrderData] = useState([]);

    const fetchOrderHistory = useCallback(async () => {
        try {
            const response = await GetCollectionOrderHistory();
            if (response.success) {
                setOrderData(response.data);
            }
        } catch (err) {
            console.error("Error fetching order history:", err);
        }
    }, []);

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);

    const routes = useMemo(() => [
        { key: 'collection', title: 'Collection History' },
        { key: 'order', title: 'Order History' },
    ], []);

    const renderScene = useMemo(() => SceneMap({
        collection: () => <CollectionHistory startDate={startDate} endDate={endDate} />,
        order: () => <OrderHistory orderData={orderData} />,
    }), [startDate, endDate, orderData]);

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
                initialLayout={{ width }}
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

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    dateInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: Color.primeBlue,
        borderRadius: 8,
        alignItems:"center"
      
    },
    dateInput: {
        fontSize: 16,
    },
    dateSeparator: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    tabContainer: {
        flex: 1,
        
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        elevation: 2,
        margin:5,

    },
    cardDate: {
        fontSize: 14,
        color: '#666',
    },
    cardAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    name:{
      fontSize:16,
      fontWeight:"700",
      color:Color.primeBlue
    },
    cardStatus: {
        fontSize: 14,
        marginTop: 8,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    tabBar: {
        backgroundColor: '#fff',
    },
    indicator: {
        backgroundColor: '#6200EE',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});

export default CollectionHistoryScreen;