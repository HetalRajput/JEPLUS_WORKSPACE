import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const InvoiceCard = ({ invoiceNo, date, dueDate, amount, days }) => {
  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.cardHeader}>
        <View style={{flexDirection:"row"}}>
        <Icon name="receipt-outline" size={20} color="#4CAF50" />
        <Text style={styles.invoiceNo}> {invoiceNo}</Text>
        </View>

        <Text style={styles.cardDate}>📅 {date}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Content Section */}
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Icon name="calendar-outline" size={18} color="#1976D2" />
          <Text style={styles.cardLabel}>Due Date:</Text>
          <Text style={styles.cardValue}>{dueDate || 'N/A'}</Text>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.infoContainer}>
          <Icon name="cash-outline" size={18} color="#4CAF50" />
          <Text style={styles.cardLabel}>Amount:</Text>
          <Text style={[styles.cardValue, styles.amount]}>₹{amount.toFixed(2)}</Text>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.infoContainer}>
          <Icon name="time-outline" size={18} color={days ? '#F44336' : '#9E9E9E'} />
          <Text style={styles.cardLabel}>Days Due:</Text>
          <Text style={[styles.cardValue, days ? styles.due : styles.noDue]}>
            {days ?? 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InvoiceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 5,
    marginHorizontal:5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    width: '95%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  
  },
  invoiceNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
 
  },
  cardDate: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginVertical: 4,
  },
  cardValue: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  amount: {
    color: '#4CAF50',
  },
  due: {
    color: '#F44336',
  },
  noDue: {
    color: '#9E9E9E',
  },
  dividerVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
  },
});
