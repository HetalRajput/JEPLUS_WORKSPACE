import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import notifee from '@notifee/react-native';

// Request permission for push notifications
export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ FCM Permission granted!');
      return await getFCMToken();
    } else {
      console.log('❌ FCM Permission denied');
    }
  } catch (error) {
    console.error('⚠️ Error requesting FCM Permission:', error);
  }
}

// Get the FCM Token
export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('🔥 FCM Token:', token);
    return token;
  } catch (error) {
    console.error('⚠️ Error fetching FCM Token:', error);
  }
}

// Display a local notification
async function displayLocalNotification(notification) {
  try {
    await notifee.requestPermission();
    
    await notifee.displayNotification({
      title: notification?.title || 'New Notification',
      body: notification?.body || 'You have a new message!',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // Ensure you have this icon in res/drawable
        importance: notifee.AndroidImportance.HIGH,
      },
    });
  } catch (error) {
    console.error('⚠️ Error displaying notification:', error);
  }
}

// Handle incoming messages when the app is in the foreground
export function setupFCMListeners(onNotificationReceived) {
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log('📩 Foreground FCM Message:', remoteMessage);
    
    const notification = remoteMessage.notification || {
      title: 'New Notification',
      body: 'You have a new message!',
    };

    await displayLocalNotification(notification);
    onNotificationReceived?.(notification);
  });

  // Background message handler - No need to unsubscribe since it runs only when app is closed
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('🌙 Background FCM Message:', remoteMessage);
  });

  return () => {
    unsubscribeOnMessage(); // ✅ This properly unsubscribes from foreground listener
  };
}