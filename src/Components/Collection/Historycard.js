import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Color } from '../../Constant/Constants';

const CollectionHistoryCard = ({ item }) => {
    console.log("this is item data",item);
    
    return (
        <LinearGradient
            colors={['#ffffff', '#f2f8ff']} // Light gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >

            {/* Card Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Invoice #{item.invoiceNo}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'COLLECTED' ? '#2E7D32' : '#FF8F00' }]}>
                    <Icon 
                        name={item.status === 'COLLECTED' ? 'checkmark-circle' : 'hourglass-outline'} 
                        size={16} 
                        color="#fff" 
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Card Body */}
            <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                    <Icon name="calendar-outline" size={18} color="#1976D2" />
                    <Text style={styles.cardText}>Date: {moment(item.date).format('DD MMM YYYY')}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Icon name="cash-outline" size={18} color="#2E7D32" />
                    <Text style={styles.cardText}>Amount: ₹{item.amount}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Icon name="cash-outline" size={18} color="#2E7D32" />
                    <Text style={styles.cardText}>Collectd Amt: ₹{item.CollectedAmount}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Icon name="person-circle-outline" size={18} color="#00796B" />
                    <Text style={styles.cardText}>Customer: {item.name}</Text>
                </View>
                <View style={styles.cardRow}>
                    <Icon name="receipt-outline" size={18} color="#616161" />
                    <Text style={styles.cardText}>Bill No: {item.billNo}</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#90CAF9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D47A1',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardBody: {
        marginTop: 8,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#424242',
        marginLeft: 10,
        fontWeight: '500',
    },
});

export default CollectionHistoryCard;
