import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; // Import Button from react-native-paper
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../Constant/Constants';
import { useAuth } from '../../Constant/Api/Authcontext';
import NoInternetPopup from '../../Components/Nointernetpopup';
import LoginfailPopup from '../../Components/Loginfail';
import axios from 'axios';

const PhoneNumberScreen = ({ navigation }) => {
  const [jePlusId, setJePlusId] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const { saveAuthData } = useAuth(); // Use saveAuthData from AuthContext

  const handleContinue = async () => {
    Keyboard.dismiss();
    const trimmedId = jePlusId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId) {
      alert('Please enter your JE Plus ID.');
      return;
    }
    if (!trimmedPassword) {
      alert('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://jemapps.in/api/auth/employee-login', {
        username: trimmedId,
        password: trimmedPassword,
      });

      if (response?.status === 200 && response?.data) {
        const { token, role, subrole } = response.data;
        console.log("Login>>>>>", token,role,subrole);
        
      
        // Save authentication data to AuthContext
        await saveAuthData(token, role, subrole);

        console.log('Login successful:', response.data);
       
      } else {
        throw new Error('Invalid credentials or unexpected response structure.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setShowErrorPopup(true); // Show error popup on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NoInternetPopup />
      <View style={styles.logoContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={require('../../Assets/Image/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Glad to see you again!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="JEPLUS ID"
          mode="outlined"
          value={jePlusId}
          onChangeText={setJePlusId}
          style={styles.textInput}
          outlineStyle={{ borderRadius: 8, borderColor: '#1568ab' }}
          theme={{ colors: { text: '#1568ab', placeholder: '#a1a1a1', primary: '#1568ab' } }}
        />
      </View>

      <TextInput
        label="PASSWORD"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!isPasswordVisible}
        style={styles.textInput}
        outlineStyle={{ borderRadius: 8, borderColor: '#1568ab' }}
        theme={{ colors: { text: '#1568ab', placeholder: '#a1a1a1', primary: '#1568ab' } }}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? 'eye-off' : 'eye'}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          loading={loading} // Show loading indicator
          disabled={loading} // Disable button when loading
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Continue
        </Button>
      </View>

      <LoginfailPopup
        visible={showErrorPopup}
        message="Login failed. Please check your credentials and try again."
        onClose={() => setShowErrorPopup(false)}
      />
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
    backgroundColor: Color.primedarkblue, // Use your primary color
    borderRadius: 30,
    paddingVertical: 4,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneNumberScreen;