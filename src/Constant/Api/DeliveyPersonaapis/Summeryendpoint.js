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

export const Summery= async () => {
  try {
    const token = await getToken(); // Get token from AsyncStorage

    // Create FormData

  

    const response = await axios.get("http://jemapps.in/api/delivery/get-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
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

