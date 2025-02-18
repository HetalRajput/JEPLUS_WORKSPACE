import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { PrimaryButton } from '../../Components/Button';

const slides = [
  {
    key: '1',
    title: 'Jeplus Healthcare Pvt. Ltd',
    text: "Jeplus Healthcare Pvt. Ltd. is a dynamic organization dedicated to delivering innovative healthcare solutions,focusing on quality and customer-centric services o enhance well-being",
    image: require('../../Assets/Image/personalloan.jpeg'), // Replace with your image
  },
  {
    key: '2',
    title: 'Excellence in Healthcare Solutions',
    text: 'At Jeplus Healthcare Pvt. Ltd., we specialize in deliveringtop-notch healthcare solutions, ensuring quality,reliability, and customer satisfaction at every step',
    image: require('../../Assets/Image/business.jpeg'), // Replace with your image
  },
  {
    key: '3',
    title: 'Innovative Healthcare Products',
    image: require('../../Assets/Image/busi.png'), // Replace with your image
    text: 'At Jeplus Healthcare Pvt. Ltd., we offer a wide range of quality healthcare products, designed to meetdiverse medical needs with innovation and reliability', 
  }
]

const Appintroslider = ({ navigation }) => {
  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    navigation.navigate('Login'); // Replace with your screen
  };

  const onSkip = () => {
    navigation.navigate('Login'); // Skip intro and go to login screen
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top center */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../Assets/Image/logo.png')} // Replace with your logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <AppIntroSlider
        renderItem={renderSlide}
        data={slides}
        onDone={onDone}
        showSkipButton
        onSkip={onSkip}
        activeDotStyle={styles.activeDot}
        dotStyle={styles.inactiveDot}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={"Login"}
          onPress={() => navigation.navigate('Login')}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop:20
   
  },
  logo: {
    width:"60%",
    height:60
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  activeDot: {
    backgroundColor: '#1568ab',
    width: 30,
    height: 8,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: '#cccccc',
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  buttonContainer: {
    
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginBottom:20,
  
    
    
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    fontSize: 14,
    color: '#1568ab', // Blue color for the link
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Underline the link
  },
});

export default Appintroslider;
