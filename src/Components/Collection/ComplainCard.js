import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ComplainCard = ({ name, description, date, enteredBy, vno, acno, description1, ComplaintStatus }) => {
    // Determine badge color based on ComplaintStatus
    const badgeColor = ComplaintStatus === 'Closed' ? '#4CAF50' : '#FF9800';

    return (
        <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{name}</Text>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{ComplaintStatus}</Text>
                </View>
            </View>

            {/* Date */}
            <Text style={styles.cardDate}>{date}</Text>

            {/* Info Section */}
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="person" size={20} color="#4CAF50" />
                    <Text style={styles.cardLabel}>Entered By:</Text>
                    <Text style={styles.cardValue}>{enteredBy}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Icon name="receipt" size={20} color="#FF9800" />
                    <Text style={styles.cardLabel}>V No:</Text>
                    <Text style={styles.cardValue}>{vno}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Icon name="account-balance" size={20} color="#2196F3" />
                    <Text style={styles.cardLabel}>Account No:</Text>
                    <Text style={styles.cardValue}>{acno}</Text>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{description}</Text>

            {/* Additional Description */}
            {description1 && (
                <Text style={styles.description}>{description1}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        width:"70%"
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    cardDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    description: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
        marginTop: 12,
        lineHeight: 20,
    },
});

export default ComplainCard;