import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL="http://jemapps.in"

// Function to fetch token from AsyncStorage
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


export const Employeecheakinout = async (formData) => {
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-today-attendance`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  
      return {
        success: true,
        data: response.data,
        message: 'Chekinout fetch successfully'
      };
    } catch (error) {
      console.error('Error chekinout', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
  
  