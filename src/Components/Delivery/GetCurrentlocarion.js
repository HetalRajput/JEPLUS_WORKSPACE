import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const getCurrentLocation = async () => {
  try {
    // Request permission for Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

export const getDistanceManual = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371.0088; // Precise Earth's radius in km
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Distance in km
    return distance.toFixed(7); // Ensuring exactly 7 decimal places
  };
  
  // Usage Example
  
  
  