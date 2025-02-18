import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the next screen after 1.7 seconds
    const timer = setTimeout(() => {  
    }, 1700);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FastImage
        source={require('../../Assets/Image/app-logo.gif')} // Ensure this path is correct
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Use your desired background color
  },
  image: {
    width: 200, // Adjust size as needed
    height: 200,
  },
});

export default SplashScreen;
