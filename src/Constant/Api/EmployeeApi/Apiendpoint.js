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
  export const Getcoworker = async (post) => {
    console.log(post);
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`  http://jemapps.in/api/employee/get-team-attendance/${post}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  
      return {
        success: true,
        data: response.data,
        message: 'Coworker fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Coworker', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };

  

  export const GetAttendance = async (sdate , edate) => {
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-attendance-by-date/${sdate}/${edate}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  
      return {
        success: true,
        data: response.data,
        message: 'Attendance fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Attendance', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
  export const GetCurrentmothdays = async (sdate , edate) => {
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-working-days`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
  
      return {
        success: true,
        data: response.data,
        message: 'Attendance fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Attendance', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
  export const GetEmployees = async () => {
    

    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-all-employee-stat`);
  
        console.log("this is employee data -->",response.data)
      return {
        success: true,
        data: response.data,
        message: 'Employee fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Employee', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
  export const GetOvertime = async () => {
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-overtime`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
    console.log(response.data);
    
      return {
        success: true,
        data: response.data,
        message: 'Attendance fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Attendance', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };

  
  export const GetLeave = async () => {
    const token = await getToken();
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-leave-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("this is salary data -->",response.data)
      return {
        success: true,
        status: response.status,
        data: response, // only the data part
      };
  
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          status: 404,
          message: 'No records found',
        };
      }
        
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.message || 'Something went wrong',
      };
    }
  };
  export const ApplyLeave = async (formData) => {
    console.log('FormData content:' ,formData);
    // For debugging - log FormData entries
 

    const token = await getToken();
  
    try {
        const response = await axios.post(
            `http://jemapps.in/api/employee/apply-leave`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Important for FormData
                }
            }
        );
        
        console.log("Leave apply response:", response.data);
        return {
            success: true,
            status: response.status,
            data: response.data, // Return response.data instead of entire response
        };

    } catch (error) {
        console.error("Leave apply error:", error);
        
        if (error.response && error.response.status === 404) {
            return {
                success: false,
                status: 404,
                message: 'No records found',
            };
        }
        
        return {
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'Something went wrong',
        };
    }
};

  export const GetSalary = async (month , year) => {
    console.log("this is month and year -->",month , year);
    
    const token = await getToken();
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-salary-breakdown/${month}/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("this is leave data -->",response.data)
      return {
        success: true,
        status: response.status,
        data: response.data, // only the data part
      };
  
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          status: 404,
          message: 'No records found',
        };
      }
        
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.message || 'Something went wrong',
      };
    }
  };