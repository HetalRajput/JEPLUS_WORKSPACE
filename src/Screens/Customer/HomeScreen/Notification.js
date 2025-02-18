import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { requestUserPermission, setupFCMListeners } from '../../../Components/Firebasepushnoti';
import moment from 'moment';
import { Color } from '../../../Constant/Constants';
import { GetNotification } from '../../../Constant/Api/Apiendpoint';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const popupAnim = new Animated.Value(-100); // Initial position (off-screen)
  const route = useRoute();
  const flatListRef = useRef(null); // Ref for the FlatList

  // Function to fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await GetNotification();
      console.log(response);
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
    fetchNotifications(); // Initial fetch of notifications

    // Listen for notifications
    const unsubscribe = setupFCMListeners((newNotification) => {
      // Update the notification list
      fetchNotifications(); // Fetch latest notifications

      // Show the notification popup
      showNotificationPopup(newNotification);

      // Scroll to top to show the latest notification
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    });

    // If app is opened from a notification
    if (route.params?.notification) {
      setNotifications((prev) => [route.params.notification, ...prev]);
    }

    return unsubscribe;
  }, [route.params?.notification]);

  // Show the notification popup
  const showNotificationPopup = (notification) => {
    setNewNotification(notification);
    setPopupVisible(true);

    // Slide the popup down
    Animated.timing(popupAnim, {
      toValue: 0, // Move to the top of the screen
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Hide the popup after 3 seconds
    setTimeout(() => {
      Animated.timing(popupAnim, {
        toValue: -100, // Move it back off-screen
        duration: 100,
        useNativeDriver: true,
      }).start(() => setPopupVisible(false));
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Notification popup */}
      {popupVisible && newNotification && (
        <Animated.View style={[styles.popup, { transform: [{ translateY: popupAnim }] }]}>
          <TouchableOpacity onPress={() => setPopupVisible(false)}>
            <View style={styles.popupContent}>
              <Image
                source={require('../../../Assets/Image/favicon.png')}
                style={styles.popupIcon}
              />
              <View style={styles.popupTextContainer}>
                <Text style={styles.popupTitle}>{newNotification.title}</Text>
                <Text style={styles.popupMessage}>{newNotification.message}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Notification list */}
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications yet</Text>
      ) : (
        <FlatList
          ref={flatListRef} // Add reference to FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationContainer}>
              <Image
                source={require('../../../Assets/Image/favicon.png')}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>
                  {moment(item.timestamp || new Date()).fromNow()}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 5,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    resizeMode: 'contain',
    backgroundColor: Color.lightBlue,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  // Popup styles
  popup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0077b6',
    padding: 12,
    zIndex: 1000,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 5,
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  popupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  popupTextContainer: {
    flex: 1,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  popupMessage: {
    fontSize: 14,
    color: '#e0e0e0',
  },
});
