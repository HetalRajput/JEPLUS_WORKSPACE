import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OutstandingCard = ({ name, osamt, vno, routes, date, acno }) => {
    return (
        <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>

            {/* Outstanding Info */}
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="account-balance" size={20} color="#2196F3" />
                    <Text style={styles.cardLabel}>Account No:</Text>
                    <Text style={styles.cardValue}>{acno}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="receipt" size={20} color="#FF9800" />
                    <Text style={styles.cardLabel}>V No:</Text>
                    <Text style={styles.cardValue}>{vno}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="attach-money" size={20} color="#4CAF50" />
                    <Text style={styles.cardLabel}>Os Amount:</Text>
                    <Text style={styles.cardValue}>₹{osamt}</Text>
                </View>


            </View>
            <View style={styles.infoContainer}>
                <Icon name="place" size={20} color="#E91E63" />
                <Text style={styles.cardLabel}>Route:</Text>
                <Text style={styles.cardValue}>{routes}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 5,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
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

export default OutstandingCard;
