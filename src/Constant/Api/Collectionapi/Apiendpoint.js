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







export const GetcollectionCustomer = async (startDate,endDate) => {
 
    try {
      const token = await getToken(); // Get token from AsyncStorage

  
   
      
      const response = await axios.get(`http://jemapps.in/api/collection/get-tag/${startDate}/${endDate}`,{
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
        }
      });
      // Handle the response data
     
      console.log(response.data);
      
      if (response.data) {
        
        return response;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  export const getCustomerInvoice = async (TagNo , acno) => {

    console.log(TagNo,acno);
    
    try {
    
    
      const response = await axios.get(`http://jemapps.in/api/collection/get-invoice/${TagNo}/${acno}`,);
  
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

  export const CollectionPay = async (formData) => {
    const token = await getToken(); // Get token from AsyncStorage
  
    console.log(">>><<<", formData);
  
    try {
      const response = await axios.postForm(`http://jemapps.in/api/collection/update-invoice`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
          'Content-Type': 'multipart/form-data', // Ensure the content type is set for form data
        }
      });
  
      console.log("this is the reponse data",response.data);
  
      return {
        success: true,
        data: response.data,
        message: 'Invoice posted successfully'
      };
    } catch (error) {
      console.error('Error posting invoice:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };