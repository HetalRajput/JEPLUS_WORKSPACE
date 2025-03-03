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

export const gettaginfo = async () => {
    try {
      const token = await getToken(); // Get token from AsyncStorage
      const response = await axios.get('http://jemapps.in/api/delivery/get-tag', {
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

  export const gettagInvoice = async (TagNo , sMan) => {
    try {
    
    
      const response = await axios.get(`http://jemapps.in/api/delivery/get-invoice/${sMan}/${TagNo}`,);
  
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
  export const PickedupInvoice = async ({ TagNo, TagDt, SMan, PickedStatus }) => {
    try {
      // Debugging: Log the data before sending
   
  
      const response = await axios.post(
        'http://jemapps.in/api/delivery/update-tag-status',
        {
          TagNo,
          TagDt,
          SMan,
          PickedStatus,
        }
      );
  

   
      return {
        success: true,
        data: response.data,
        message: 'Tag status updated successfully',
      };
    } catch (error) {
      console.error('Error updating tag status:', error.response?.data || error.message);
  
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update tag status',
      };
    }
  };
  export const getSelectdInvoice = async () => {
    try {
      const token = await getToken(); // Get token from AsyncStorage
      const response = await axios.get('http://jemapps.in/api/delivery/get-selected-invoice/', {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to request headers
        }
      });
     console.log(response.data);
     
      // Return the user info with a success status
      
      
      return {
        success: true,
        data: response.data, // User info data
        message: 'Invoice info fetched successfully'
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
  export const Sendotp = async (acno, name) => {
    console.log(acno, name);
    
    try {
      const response = await axios.post("http://jemapps.in/api/delivery/send-otp", { acno, name });
    
     
      return {
        success: true,
        data: response,  // Extracting response data
        message: "OTP sent successfully",
      };
    } catch (error) {
      console.error("Error in send OTP:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    }
  };
  export const Verifyotp = async (acno, otp) => {
    try {
      const response = await axios.post("http://jemapps.in/api/delivery/verify-otp", { acno, otp });
  
      if (response.status === 200 && response.data?.success) {
        return {
          success: true,
          message: response.data.message || "OTP verified successfully",
        };
      } else {
        return {
          success: false,
          message: response.data?.message || "Invalid OTP. Please try again.",
        };
      }
    } catch (error) {
      console.error("Error in verify OTP:", error);
  
      let errorMessage = "Failed to verify OTP";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid OTP. Please try again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
  
      return {
        success: false,
        message: errorMessage,
      };
    }
  };
  