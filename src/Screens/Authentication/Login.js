import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Color } from '../../Constant/Constants';
import { useAuth } from '../../Constant/Api/Authcontext';
import LoginfailPopup from '../../Components/Other/Loginfail';

const OTPVerificationScreen = ({ navigation }) => {
  const [jePlusId, setJePlusId] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { saveAuthData } = useAuth();

  // Function to show snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // Function to send OTP
  const handleSendOtp = async () => {
    Keyboard.dismiss();
    const trimmedId = jePlusId.trim();

    if (!trimmedId) {
      showSnackbar('Please enter your JE Plus ID.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://jemapps.in/api/auth/send-otp', {
        code: trimmedId,  // Send JE Plus ID
      });

      if (response.status === 200) {
        showSnackbar('OTP sent successfully.');
        setIsOtpSent(true);
      } else {
        throw new Error('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    const trimmedId = jePlusId.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      showSnackbar('Please enter the OTP.');
      return;
    }

    setLoading(true);
    console.log(trimmedId, trimmedOtp);

    try {
      const response = await axios.post('http://jemapps.in/api/auth/verify-otp', {
        code: trimmedId,    // Send JE Plus ID
        otp: trimmedOtp,
      });
      console.log(response.data);

      if (response.status === 200 && response.data) {
        const { token, role = [] } = response.data;

        // Save auth data to context
        await saveAuthData(token, role);
        showSnackbar('OTP verified successfully.');
      } else {
        throw new Error('Invalid OTP or unexpected response structure.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>


      <View style={styles.logoContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={require('../../Assets/Image/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter your JE Plus ID to receive an OTP</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="JE PLUS ID"
          mode="outlined"
          value={jePlusId}
          onChangeText={setJePlusId}
          style={styles.textInput}
          outlineStyle={{ borderRadius: 8, borderColor: '#1568ab' }}
          theme={{ colors: { text: '#1568ab', placeholder: '#a1a1a1', primary: '#1568ab' } }}
          disabled={isOtpSent}
        />
      </View>

      {isOtpSent && (
        <TextInput
          label="Enter OTP"
          mode="outlined"
          value={otp}
          onChangeText={setOtp}
          style={styles.textInput}
          keyboardType="numeric"
          outlineStyle={{ borderRadius: 8, borderColor: '#1568ab' }}
          theme={{ colors: { text: '#1568ab', placeholder: '#a1a1a1', primary: '#1568ab' } }}
        />
      )}

      <View style={styles.footer}>
        {!isOtpSent ? (
          <Button
            mode="contained"
            onPress={handleSendOtp}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Send OTP
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleVerifyOtp}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Verify OTP
          </Button>
        )}
      </View>

      <LoginfailPopup
        visible={showErrorPopup}
        message="Failed to verify OTP. Please try again."
        onClose={() => setShowErrorPopup(false)}
      />

      {/* Snackbar for better feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  logo: {
    width: '60%',
    height: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#1B1B1D',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#6C6C6C',
    lineHeight: 22,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '90%',
    backgroundColor: Color.primedarkblue,
    borderRadius: 30,
    paddingVertical: 4,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#1568ab',
  },
});

export default OTPVerificationScreen;
