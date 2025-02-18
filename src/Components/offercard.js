import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Ensure this package is installed
import { useNavigation } from '@react-navigation/native';

const OfferCard = ({onpress}) => {
 



  return (
    <Pressable onPress={onpress} style={styles.container}>
      <LinearGradient colors={['#240023', '#2299e5']} style={styles.card}>
        <Text style={styles.cardTitle}>Special Offer!</Text>
        <Text style={styles.cardSubtitle}>Get up to 50% off on your first purchase</Text>
        <Text style={styles.cardCTA}>Tap to explore</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
  card: {
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginHorizontal:5,
    alignItems: 'center',
    marginTop:10
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardCTA: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
});

export default OfferCard;
