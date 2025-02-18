import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

// Function to get token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken'); // Replace 'authToken' with your actual key
    if (token !== null) {
      return token;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};


// Function to place an order
export const placeOrder = async (orderPayload) => {
  try {
    // Get token from AsyncStorage
    const token = await getToken();
    console.log(token);
    

    // API endpoint
    const url = 'http://jemapps.in/api/product/place-order';

    // Make POST request with the provided payload
    const response = await axios.post(url, orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        'Content-Type': 'application/json', // Ensure content type is set correctly
      },
    });
   
    
    // Handle successful response
    if (response.status === 200 || response.status === 201) {
      
      return response;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    // Log and rethrow error
    console.error('Error placing order:', error.response?.data || error.message);
    throw error;
  }
};