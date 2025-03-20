import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../../Constant/Constants';

const { width } = Dimensions.get('window');

const OutstandingTab = ({ navigation }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => navigation.navigate('Outstanding'));
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.card}>
          <Icon name="account-balance-wallet" size={42} color={Color.red} />
          <Text style={styles.title}>View Outstanding</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default OutstandingTab;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.47,
    height: 100,
    backgroundColor: '#fff',   // White background
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth:.5,
    borderColor:Color.primeBlue
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Color.black,     // Use your constant color
    marginTop: 8,
    textAlign: 'center',
  },
});
