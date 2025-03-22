import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCollectionInv } from '../../../Constant/Api/Collectionapi/Apiendpoint';

const { width } = Dimensions.get('window');

const CollectionHistoryInvScreen = ({ route }) => {
    const { startDate, endDate, acno, tagNo } = route.params;

    // Debug route.params
  
    const [loading, setLoading] = useState(true);
    const [collectionHistory, setCollectionHistory] = useState([]);
    const [error, setError] = useState(null);

    // Fetch collection history data
    useEffect(() => {
        // Ensure startDate and endDate are valid strings before slicing

        const fetchCollectionHistory = async () => {
            try {
                setLoading(true);
                const response = await getCollectionInv(acno , tagNo, startDate, endDate);
                console.log('API Response:', response);

                if (response.success) {
                    // Map the API response to the required format
                    const formattedData = response.data.map(item => ({
                        name: item.BillNo, // Use BillNo as the name
                        invoiceNo: item.VNo, // Use VNo as the invoice number
                        date: item.TAGDt ? item.TAGDt.split('T')[0] : 'N/A', // Format date
                        amount: item.Amt, // Use Amt as the amount
                        collectedAmount: item.CollectedAmount, // Use CollectedAmount
                        outstandingAmount: item.OSAmount, // Use OSAmount
                        status: item.PayMethod
                    }));

                    setCollectionHistory(formattedData);
                } else {
                    setError('Failed to fetch collection history.');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollectionHistory();
    }, [startDate, endDate, acno, tagNo]);

    // Render loading state
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1976D2" />
            </View>
        );
    }

    // Render error state
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Render each invoice item as a card
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.cardDate}>Invoice No: {item.invoiceNo}</Text>
                </View>
                <View style={[styles.statusBadge]}>
                    <Icon
                        name={"checkmark-circle"}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="calendar-outline" size={18} color="#1976D2" />
                    <Text style={styles.cardLabel}>Date:</Text>
                    <Text style={styles.cardValue}>{item.date}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="cash-outline" size={18} color="#4CAF50" />
                    <Text style={styles.cardLabel}>Amount:</Text>
                    <Text style={styles.cardValue}>₹{item.amount.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="wallet-outline" size={18} color="#FF9800" />
                    <Text style={styles.cardLabel}>Collected:</Text>
                    <Text style={styles.cardValue}>₹{item.collectedAmount.toFixed(2)}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="alert-circle-outline" size={18} color="#F44336" />
                    <Text style={styles.cardLabel}>Outstanding:</Text>
                    <Text style={styles.cardValue}>₹{item.outstandingAmount.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );

    // Render collection history list
    return (
        <View style={styles.container}>
            <FlatList
                data={collectionHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item.invoiceNo.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No collection history found.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
       
    },
    listContainer: {
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
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
    nameContainer: {
        maxWidth: width * 0.6,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flexWrap: 'wrap',
    },
    cardDate: {
        fontSize: 12,
        color: '#666',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor:"#4CAF50"
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 6,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        marginHorizontal: 6,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default CollectionHistoryInvScreen;