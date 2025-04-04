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
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`http://jemapps.in/api/employee/get-leave-history`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
    console.log(response.data);
    
      return {
        success: true,
        data: response.data,
        message: 'Leave fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching Leave', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
  export const GetSalary = async () => {
    
    const token = await getToken(); // Get token from AsyncStorage 
  
    try {
      const response = await axios.get(`https://jemapps.in/api/employee/get-salary-breakdown/2/2025`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to request headers
        }
      });
  
    console.log(response.data);
    
      return {
        success: true,
        data: response.data,
        message: 'Salary fetch successfully'
      };
    } catch (error) {
      console.error('Error fetching salary', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
