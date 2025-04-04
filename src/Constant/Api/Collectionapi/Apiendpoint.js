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
     
     
      
      if (response.data) {
        
        return response;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  export const PunchInOut = async (formData) => {
    try {
      const token = await getToken(); // Get token from AsyncStorage
  
      // Create FormData
  
    
     
      
      const response = await axios.post("http://jemapps.in/api/collection/collboy-in-out", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for FormData
        },
      });
  
      return {
        success: true,
        data: response.data,
        message: "Data uploaded successfully",
      };
    } catch (error) {
      console.error("Error uploading data:", error);
      return {
        success: false,
        message: error.message || "Failed to upload data",
      };
    }
  };
  export const getCustomerInvoice = async (TagNo , acno) => {

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
  
    try {
      const response = await axios.postForm(`http://jemapps.in/api/collection/update-invoice`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
          'Content-Type': 'multipart/form-data', // Ensure the content type is set for form data
        }
      });
  
  
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

  export const CollectionSummery = async () => {
 
    
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-summary`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
      
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
  export const Getuser = async () => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/users/get-collection-person`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
 
  
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




  export const CustomerSearch = async (query) => { // Accept query as a string, not an object

    
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/search-customer/${query}`);
  
      return {
        success: true,
        data: response,
        message: "Customers fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
  
      return {
        success: false,
        data: [],
        message: error.message || "Failed to fetch customers",
      };
    }
  };
  export const placeOrder = async (orderPayload) => {
    console.log("this is placed order payload",orderPayload);
    
    try {
      // Get token from AsyncStorage
      const token = await getToken();
     
      
  
      // API endpoint
      const url = 'http://jemapps.in/api/product/place-order';
  
      // Make POST request with the provided payload
      const response = await axios.post(url, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
          'Content-Type': 'application/json', // Ensure content type is set correctly
        },
      });
     
      console.log(response.data);
      
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

  export const GetCollectionhistory= async (startDate,endDate) => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/collection-history/${startDate}/${endDate}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
    
  
      return {
        success: true,
        data: response.data,
        message: 'Customers history fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching customers collection history:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to fetch customers collection history'
      };
    }
  };
  export const getCollectionInv = async (acno, tagno, startDate, endDate) => {
    // Convert startDate and endDate to strings (if they are not already)
    const startDateStr = startDate ? new Date(startDate).toISOString() : '';
    const endDateStr = endDate ? new Date(endDate).toISOString() : '';

    // Slice the dates to extract YYYY-MM-DD
    const slicedStartDate = startDateStr.slice(0, 10);
    const slicedEndDate = endDateStr.slice(0, 10);

    console.log('Sliced Start Date:', slicedStartDate);
    console.log('Sliced End Date:', slicedEndDate);

    const token = await getToken(); // Get token from AsyncStorage

    try {
        const response = await axios.get(
            `http://jemapps.in/api/collection/collection-history-invoice/${acno}/${tagno}/${slicedStartDate}/${slicedEndDate}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add Bearer token to request headers
                },
            }
        );

        return {
            success: true,
            data: response.data,
            message: 'Customers history fetched successfully',
        };
    } catch (error) {
        console.error('Error fetching customers collection history:', error);

        return {
            success: false,
            message: error.message || 'Failed to fetch customers collection history',
        };
    }
};


  export const Markasvisit = async (body) => {
    console.log("this is placed order payload",body);
    
    try {
      // Get token from AsyncStorage
      const token = await getToken();
     
      
  
      // API endpoint
      const url = 'http://jemapps.in/api/collection/update-visit-status';
  
      // Make POST request with the provided payload
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
          'Content-Type': 'application/json', // Ensure content type is set correctly
        },
      });
     
      console.log(response.data);
      
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


  export const SummeryDetail = async (sdate,edate) => {

    
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-summary-details/${sdate}/${edate}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  console.log("tis is summery response data >>>>>",response.data);
  
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

  export const SearchCustomer = async (query) => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/find-customer-tags/${query}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  
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

  export const GetCollectionOrderHistory = async (startDate , endDate) => {
    console.log(startDate,endDate);
    
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-order-history-by-sman/${startDate}/${endDate}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      console.log(response.data);
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get collection successfully'
      };
    } catch (error) {
      console.error('Error posting invoice:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };

  export const GetcollectionComplain = async (query) => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-complaints`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      console.log(response.data);
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get collection complain successfully'
      };
    } catch (error) {
      console.error('Error posting invoice:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };
  export const SearchComplaints = async (query) => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/search-complant/${query}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      console.log("search data>>>>>>>>>>>>",response.data);
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get collection complain successfully'
      };
    } catch (error) {
      console.error('Error posting invoice:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };

  export const PostComplain = async (body) => {  
    try {
      // Get token from AsyncStorage
      const token = await getToken();
      // API endpoint
      const url = 'http://jemapps.in/api/collection/add-staff-complaint';
  
      // Make POST request with the provided payload
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
          'Content-Type': 'application/json', // Ensure content type is set correctly
        },
      });
     
       return response;
    } catch (error) {
      // Log and rethrow error
      console.error('Error placing order:', error.response?.data || error.message);
      throw error;
    }
  };
  export const Getcustomeroutstanding = async () => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-ost`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get customer outstanding successfully'
      };
    } catch (error) {
      console.error('Error get outstanding:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };
  export const SearchOutstandings = async (query) => {
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/search-ost/${query}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      console.log(response.data);
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get customer outstanding successfully'
      };
    } catch (error) {
      console.error('Error get outstanding:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };

  export const GetOsInvoices = async (acno, routes) => {
  
    const token = await getToken(); // Get token from AsyncStorage
  
  
    try {
      const response = await axios.get(`http://jemapps.in/api/collection/get-ost-invoice/${acno}/${routes}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
      console.log("This is the os data >>>>>>>>>>>",response.data);
      
  
      return {
        success: true,
        data: response.data,
        message: 'Get customer outstanding Invoice successfully'
      };
    } catch (error) {
      console.error('Error get outstanding:', error);
  
      return {
        success: false,
        message: error.message || 'Failed to post invoice'
      };
    }
  };