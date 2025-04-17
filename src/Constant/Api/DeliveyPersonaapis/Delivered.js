import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (token !== null) {
      return token;
    } else {
      throw new Error("Token not found");
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw error;
  }
};

export const Pay = async (formData) => {
  console.log("this is form data >>>>>><<<<<", formData);

  try {
    const token = await getToken(); // Get token from AsyncStorage

    const response = await axios.post("http://jemapps.in/api/delivery/uploadV2", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    });

  console.log(response);
  

    return {
      success: true,
      data: response.data,
      message: "Data uploaded successfully",
    };

  } catch (error) {
    // Handle and log detailed error response
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Server error response:", error.response.data);
      return {
        success: false,
        message: error.response.data?.message || "Server error occurred",
        errorData: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      return {
        success: false,
        message: "No response received from the server",
      };
    } else {
      // Something else went wrong in setup
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        message: error.message || "Request setup error",
      };
    }
  }
};
