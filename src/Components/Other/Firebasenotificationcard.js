import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing,Image } from 'react-native';
import { requestUserPermission, setupFCMListeners } from './Firebasepushnoti'; // Ensure these functions are implemented correctly
import { Color } from '../../Constant/Constants';

const { width } = Dimensions.get('window'); // Dynamic width adjustment

const NotificationCard = () => {
  const [notification, setNotification] = useState(null); // Holds the current notification
  const slideAnim = useRef(new Animated.Value(-150)).current; // Start off-screen

  useEffect(() => {
    // Request notification permissions
    requestUserPermission();

    // Set up FCM listeners
    const unsubscribe = setupFCMListeners((newNotification) => {
      setNotification(newNotification);
      slideInNotification();
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const slideInNotification = () => {
    Animated.timing(slideAnim, {
      toValue: 10, // Slide down with a margin
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      slideOutNotification();
    }, 4000);
  };

  const slideOutNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -150, // Slide up off-screen
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setNotification(null)); // Reset notification
  };

  return notification ? (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={{flexDirection:"row"}}onPress={slideOutNotification} activeOpacity={0.8}>
        <Image
        source={require('../Assets/Image/favicon.png')}
        style={{height:40,width:40,borderRadius:8}}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{notification.title || 'Notification'}</Text>
          <Text style={styles.body}>{notification.body || 'You have a new message!'}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ) : null; // Render nothing if no notification
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    width: width - 20, // Adjusted width for responsiveness
 
  },
  cardContent: {
    flexDirection: 'column',
    marginLeft:10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'lack',
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    color: 'black',
  },
});

export default NotificationCard;
