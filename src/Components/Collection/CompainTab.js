import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>View Complaints</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ComplainTab;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
   
  },
  card: {
    width: width * 0.5,   // 50% of the screen width
    height: 100,           // Increased height
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
    tintColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
});
