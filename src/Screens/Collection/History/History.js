import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
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

// Reducer for state management
const initialState = {
    collectionData: [],
    orderData: [],
    loading: true,
    refreshing: false,
    error: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, refreshing: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, refreshing: false, [action.payload.key]: action.payload.data };
        case 'FETCH_ERROR':
            return { ...state, loading: false, refreshing: false, error: action.payload };
        default:
            return state;
    }
}

// Collection History Component
const CollectionHistory = ({ startDate, endDate }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchCollection = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
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
                dispatch({ type: 'FETCH_SUCCESS', payload: { key: 'collectionData', data: formattedData } });
            } else {
                dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch collection history.' });
            }
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', payload: 'An error occurred while fetching data.' });
            console.error("Error fetching collection history:", err);
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

    if (state.loading) {
        return <ActivityIndicator size="large" color={Color.primeBlue} style={styles.loader} />;
    }

    if (state.error) {
        return <Text style={styles.errorText}>{state.error}</Text>;
    }

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={state.collectionData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No Collection History</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={state.refreshing}
                        onRefresh={onRefresh}
                        colors={[Color.primeBlue]}
                    />
                }
            />
        </View>
    );
};

// Order History Component
const OrderHistory = ({ orderData, fetchOrderHistory }) => {
    const [refreshing, setRefreshing] = useState(false);

    const formattedOrderData = useMemo(() => {
        return orderData.map(item => ({
            id: item.Ordno.toString(),
            date: moment(item.Odt).format('YYYY-MM-DD'),
            items: item.order_count,
            amount: item.amt,
            status: item.order_status,
            name: item.name
        }));
    }, [orderData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrderHistory(); // Fetch new data
        setRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}># {item.name}</Text>
                <Text style={styles.cardDate}>📅 {item.date}</Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Text style={styles.cardLabel}>📦 Items:</Text>
                    <Text style={styles.cardValue}>{item.items}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.cardLabel}>💰 Amount:</Text>
                    <Text style={styles.cardValue}>₹{item.amount}</Text>
                </View>
            </View>
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
        const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
        try {
            const response = await GetCollectionOrderHistory(formattedStartDate, formattedEndDate);
            if (response.success) {
                setOrderData(response.data);
            }
        } catch (err) {
            console.error("Error fetching order history:", err);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);

    const routes = useMemo(() => [
        { key: 'collection', title: 'Collection History' },
        { key: 'order', title: 'Order History' },
    ], []);

    const renderScene = useMemo(() => SceneMap({
        collection: () => <CollectionHistory startDate={startDate} endDate={endDate} />,
        order: () => <OrderHistory orderData={orderData} fetchOrderHistory={fetchOrderHistory} />,
    }), [startDate, endDate, orderData, fetchOrderHistory]);

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
        alignItems: "center"
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
        borderRadius: 12,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDate: {
        fontSize: 12,
        color: '#666',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        marginRight: 6,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
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
    emptyText: {
        textAlign: "center"
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
});

export default CollectionHistoryScreen;