import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color } from '../Constant/Constants';

const { width } = Dimensions.get('window'); // Get screen width

const OutstandingAndHistoryCards = ({ onOutstandingPress, onHistoryPress, DueAmt, TotalPurchaseAmt }) => {
  return (
    <View style={styles.container}>
      {/* Outstanding Card */}
      <TouchableOpacity style={styles.cardContainer} onPress={onOutstandingPress}>
        <LinearGradient
          colors={['#FF6F61', '#FF9068']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.iconContainer}>
            <Icon name="cash" size={width * 0.08} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Outstanding</Text>
            <Text style={styles.cardValue}>₹ {DueAmt}</Text>
            <Text style={styles.cardInfo}>Pending</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Purchase History Card */}
      <TouchableOpacity style={styles.cardContainer} onPress={onHistoryPress}>
        <LinearGradient
          colors={['#4FACFE', '#00F2FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.iconContainer}>
            <Icon name="history" size={width * 0.08} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Purchase</Text>
            <Text style={styles.cardValue}>₹ {TotalPurchaseAmt}</Text>
            <Text style={styles.cardInfo}>Last 7 days</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    width: '100%',
    
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: width * 0.015, // Responsive margin
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04, // Responsive padding
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    marginRight: width * 0.04, // Responsive margin
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: width * 0.04, // Dynamic font size
    fontWeight: 'bold',
    color: '#fff',
    width:100,
  },
  cardValue: {
    marginTop: width * 0.01,
    fontSize: width * 0.05, // Dynamic font size
    fontWeight: 'bold',
    color: '#fff',
  },
  cardInfo: {
    marginTop: width * 0.01,
    fontSize: width * 0.03, // Dynamic font size
    color: '#fff',
  },
});

export default OutstandingAndHistoryCards;
