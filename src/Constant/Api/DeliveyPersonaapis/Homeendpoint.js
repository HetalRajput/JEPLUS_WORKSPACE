import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
    try {
      
      
      const token = await AsyncStorage.getItem('authToken'); // 'userToken' is the key where token is stored
      if (token !== null) {
        return token; // Return the token if found
      } else {
        throw new Error('Token not found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  };
  

export const getUserInfo = async () => {
    try {
      const token = await getToken(); // Get token from AsyncStorage
      const response = await axios.get('http://jemapps.in/api/users/get', {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
        }
      });
  
      // Return the user info with a success status
      return {
        success: true,
        data: response.data, // User info data
        message: 'User info fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
  
      // Return a failure status with the error message
      return {
        success: false,
        message: error.message || 'Failed to fetch user info'
      };
    }
  };