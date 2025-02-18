import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color } from '../Constant/Constants';

const BusinessCard = ({ userinfo }) => {
   
    
  return (
    <View style={styles.businessInfoCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.businessName}>
          {userinfo?.data?.name || 'Business Name'}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Gst: </Text>
          {userinfo?.data?.gstNo || 'N/A'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Email: </Text>
          {userinfo?.data?.email || 'example@example.com'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Phone: </Text>
          {userinfo?.data?.mobile || '123-456-7890'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Address: </Text>
          {userinfo?.data?.address || 'No Address Provided'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  businessInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    marginTop:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: Color.detailsGray,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: Color.primeBlue,
  },
  cardBody: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 3,
    lineHeight: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
});

export default BusinessCard;
