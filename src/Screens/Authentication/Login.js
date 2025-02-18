import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { PrimaryButton } from "../../Components/Button";
import { Color } from "../../Constant/Constants";
import { useAuth } from "../../Constant/Api/Authcontext"; // Import useAuth from context
import NoInternetPopup from "../../Components/Nointernetpopup";




const PhoneNumberScreen = ({ navigation }) => {
  const [jePlusId, setJePlusId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login, loading, error: authError } = useAuth(); // Get login, loading, and error from context

  const handleContinue = async () => {
    // Trim inputs to avoid leading/trailing spaces
    const trimmedId = jePlusId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId) {
      setError("Please enter your JE Plus ID.");
      return;
    }
    if (!trimmedPassword) {
      setError("Please enter your password.");
      return;
    }

    setError("s"); // Clear error if validation passes

    try {
      // Use the login function from the context and get the response
      const response = await login(trimmedId, trimmedPassword);
      
      
      // Check if the response status is 200 and navigate
      if (response && response.status === 200) {
          console.log(response);
          
      } else {
        
        setError(response?.data?.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
    <NoInternetPopup/>
      {/* Logo and Back Button */}
      <View style={styles.logoContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image
          source={require("../../Assets/Image/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Employee Login!</Text>
      <Text style={styles.subtitle}>Glad to see you again!</Text>

      {/* JE Plus ID Input */}
      <View style={styles.inputContainer}>
        <TextInput
          label="JEPLUS ID"
          mode="outlined"
          value={jePlusId}
          onChangeText={(text) => {
            setJePlusId(text);
            if (error) setError(""); // Clear error on input change
          }}
          style={styles.textInput}
          outlineStyle={{
            borderRadius: 8,
            borderColor: "#1568ab",
          }}
          theme={{
            colors: {
              text: "#1568ab",
              placeholder: "#a1a1a1",
              primary: "#1568ab",
            },
          }}
        />
      </View>

      {/* Password Input */}
      <TextInput
        label="PASSWORD"
        mode="outlined"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(""); // Clear error on input change
        }}
        secureTextEntry={!isPasswordVisible} // Toggle visibility
        style={styles.textInput}
        outlineStyle={{
          borderRadius: 8,
          borderColor: "#1568ab",
        }}
        theme={{
          colors: {
            text: "#1568ab",
            placeholder: "#a1a1a1",
            primary: "#1568ab",
          },
        }}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
      />


      {/* Error Message */}
      {(error || authError) && <Text style={styles.errorText}>{error || authError}</Text>}

      {/* Footer with Continue Button */}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={Color.primeBlue} />
        ) : (
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={loading} // Disable button during loading
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  logo: {
    width: "60%",
    height: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#1B1B1D",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#6C6C6C",
    lineHeight: 22,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    width: "100%",
  },
});

export default PhoneNumberScreen;
