import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestUserPermission ,setupFCMListeners, getFCMToken ,  } from '../../Components/Other/Firebasepushnoti';


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
const getFcmToken = async () => {
  try {
    
    await requestUserPermission(); // Ask for permission
    const FCMtoken = await getFCMToken(); // Get FCM Token
    if (FCMtoken) {
      return FCMtoken; // Return the token if found
    } else {
      throw new Error('FCMToken not found');
    }
  } catch (error) {
    console.error('Error retrieving FCMtoken:', error);
    throw error;
  }
};


// Function to fetch user info with Bearer Token from AsyncStorage
export const getUserInfo = async () => {
  try {
    const token = await getToken(); // Ensure you have a function to fetch the token
    const response = await axios.get(`${BASE_URL}/api/users/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userInfo = response.data.data; // Extract user info
    const discount = userInfo.dis; // Assuming `dis` contains the discount value
    const usercode = userInfo.code;
   
    // Save the discount in AsyncStorage
    if (discount !== undefined) {
      await AsyncStorage.setItem('userDiscount', discount.toString());
    }

    // Save the user code in AsyncStorage
    if (usercode !== undefined) {
      await AsyncStorage.setItem('userCode', usercode.toString());
    }


    return {
      success: true,
      data: userInfo,
      message: 'User info fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user info',
    };
  }
};


export const getBanner = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/banners`);

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



// Function to get all products with pagination
 export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/all-productsV2`, {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });

    // Handle the response data
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


export const searchProduct = async (query) => {

  if (!query || query.trim().length < 2) {
    
     // Return an empty result for invalid queries
  }

  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(
      `${BASE_URL}/api/product/searchV2/${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
        }
      }
    );
     
     

    
    // Return the search results
    return response.data;
  } catch (error) {
    console.error('Error searching for product:', error);

    // Throw a more descriptive error if needed
    throw new Error('Failed to fetch search results. Please try again.');
  }
};

export const recentAddedItems = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/recent-itemsV2`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
      }
    );
    // Handle the response data
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const TopsellingItems = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/top-sellingV2`,
      {
          headers:{
            Authorization: `Bearer ${token}` // Add Bearer token to request headers
          }
      }
    );
    // Handle the response data
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

//overdue api

export const overDue = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/outstanding-bills`,{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data
   
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const OrderHistory = async (startDate,endDate) => {
 
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/order-history/${startDate}/${endDate}`,{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data
   
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};





export const orderhistoryitems = async ({Ordno}) => {
  
  
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/order-history-items/${Ordno}`);
    // Handle the response data
 
 
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


export const category = async () => {
  try {
    const response = await axios.get(`http://jemapps.in/api/product/categories`);
    // Handle the response data
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const categoryitems = async ({code}) => {
  try {
   const token = await getToken(); // Get token from AsyncStorage
    
    const response = await axios.get(`http://jemapps.in/api/product/get-productsV2/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    }
    );
    // Handle the response data
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const OfferProduct = async () => {
  try {
    const response = await axios.get(`http://jemapps.in/api/product/get-offer`);
    // Handle the response data]
   
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
// Function to place an order
export const feedback = async (payload) => {
  try {
    // Get token from AsyncStorage
    const token = await getToken();

    

    // API endpoint
    const url = 'http://jemapps.in/api/product/feedback' ;

    // Make POST request with the provided payload
    const response = await axios.post(url, payload, {
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
export const Purchasehistory = async (startDate,endDate) => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/get-invoice/${startDate}/${endDate}`,{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const Postdatedcheak = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/product/get-post-dated-checklist`,{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data
 
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const Postfcmtoken = async () => {

const fcmtoken = await getFcmToken();



  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.post(`http://jemapps.in/api/auth/create-push-token`,{token:fcmtoken},{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data
   
    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fcm token does not send :", error);
    throw error;
  }
};

export const GetNotification = async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    const response = await axios.get(`http://jemapps.in/api/push-notify/get-notification`,{
      headers: {
        Authorization: `Bearer ${token}` // Add Bearer token to request headers
      }
    });
    // Handle the response data

    
    if (response.data) {
      
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};





