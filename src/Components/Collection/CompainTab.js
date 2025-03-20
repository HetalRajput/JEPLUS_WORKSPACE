import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../Constant/Constants';

const { width } = Dimensions.get('window');

const ComplainTab = ({ navigation }) => {
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
    }).start(() => navigation.navigate('Complains'));
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.card} // Applied white background directly
      >
        <Icon name="chatbox-ellipses-outline" size={42} color={Color.orange} />
        <Text style={styles.title}>View Complaints</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ComplainTab;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.47,
    height: 100,
    backgroundColor: '#fff',  // White background
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
    color: '#000',  // Text color changed to black for better visibility
    marginTop: 8,
    textAlign: 'center',
  },
});
