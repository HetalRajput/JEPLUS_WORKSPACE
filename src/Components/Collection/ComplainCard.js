import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using MaterialIcons for icons

const ComplainCard = ({ name, description, date, status, enteredBy, vno, acno }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <Icon name="info-outline" size={20} color="#007BFF" />
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color="#888" />
          <Text style={styles.detailText}>Entered By: {enteredBy}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={16} color="#888" />
          <Text style={styles.detailText}>Voucher No: {vno}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account-balance" size={16} color="#888" />
          <Text style={styles.detailText}>Account No: {acno}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>Date: {date}</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin:5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ComplainCard;