import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const { width } = Dimensions.get('window');

const CollectionHistoryCard = ({ item }) => {
    return (
        <View style={styles.card}>

            {/* Header Section */}
            <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.cardDate}>Date: {moment(item.date).format('DD MMM YYYY')}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'COLLECTED' ? '#4CAF50' : '#FFC107' }]}>
                    <Icon
                        name={item.status === 'COLLECTED' ? 'checkmark-circle' : 'time-outline'}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="receipt-outline" size={18} color="#1976D2" />
                    <Text style={styles.cardLabel}>Invoice:</Text>
                    <Text style={styles.cardValue}>#{item.invoiceNo}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="pricetag-outline" size={18} color="#4CAF50" />
                    <Text style={styles.cardLabel}>Amount:</Text>
                    <Text style={styles.cardValue}>₹{item.amount}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="cash-outline" size={18} color="#FF9800" />
                    <Text style={styles.cardLabel}>Collected:</Text>
                    <Text style={styles.cardValue}>₹{item.CollectedAmount}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="barcode-outline" size={18} color="#9C27B0" />
                    <Text style={styles.cardLabel}>Bill No:</Text>
                    <Text style={styles.cardValue}>{item.billNo}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        maxWidth: width * 0.6,   // Ensure the name takes up a responsive width
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flexWrap: 'wrap',        // Allow text to wrap
        
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

export default CollectionHistoryCard;
