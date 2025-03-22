import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CollectionHistoryCard = ({ item }) => {

    
    return (
        <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.cardDate}>TAG No: {item.tagNo}</Text>
                </View>
                
            </View>

            {/* Content Section */}
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="receipt-outline" size={18} color="#1976D2" />
                    <Text style={styles.cardLabel}>Account No:</Text>
                    <Text style={styles.cardValue}>{item.acno}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="pricetag-outline" size={18} color="#4CAF50" />
                    <Text style={styles.cardLabel}>Invoice Count:</Text>
                    <Text style={styles.cardValue}>{item.invCount}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="cash-outline" size={18} color="#FF9800" />
                    <Text style={styles.cardLabel}>Amount:</Text>
                    <Text style={styles.cardValue}>₹{item.totalAmt.toFixed(2)}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="barcode-outline" size={18} color="#9C27B0" />
                    <Text style={styles.cardLabel}>Collection:</Text>
                    <Text style={styles.cardValue}>₹{item.totalCollectedAmt.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="alert-circle-outline" size={18} color="#F44336" />
                    <Text style={styles.cardLabel}>Outstanding Amount:</Text>
                    <Text style={styles.cardValue}>₹{item.totalOsAmt.toFixed(2)}</Text>
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
        shadowOpacity: 0.9,
        shadowRadius: 1,
        elevation: 2,
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
        maxWidth: width * 0.6, // Ensure the name takes up a responsive width
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flexWrap: 'wrap', // Allow text to wrap
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