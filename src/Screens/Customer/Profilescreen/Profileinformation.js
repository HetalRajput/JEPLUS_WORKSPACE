import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import CustomTextInput from '../../../Components/CustomInput';
import { Color } from '../../../Constant/Constants';

const ProfileInfoScreen = ({ route }) => {
  const { userData } = route.params; // Fetch user data from route params

  // State variables for user data
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [mobile, setMobile] = useState(userData?.mobile || '');
  const [address, setAddress] = useState(userData?.address || 'N/A');
  const [address1, setAddress1] = useState(userData?.address1 || 'N/A');
  const [statecode, setStatecode] = useState(userData?.stateCode || 'N/A');
  const [gstno, setGstno] = useState(userData?.gstNo || 'N/A');
  const [pan, setPan] = useState(userData?.pan || 'N/A');
  const [crlimits, setCrlimit] = useState(userData?.crlimit || 'N/A');
  const [discounts, setDiscount] = useState(userData?.dis || 'N/A');
  const [dlno, setDlno] = useState(userData?.dlno || 'N/A');

  // State variables for dropdown toggles
  const [showDestinationInfo, setShowDestinationInfo] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  useEffect(() => {
    console.log("Initial Credit Limit:", crlimits);
    console.log("Initial Discount:", discounts);
  }, [crlimits, discounts]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <View style={styles.header}>
        <Image
          source={require('../../../Assets/Image/profile.png')}
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.sectionTitle}>Profile Information</Text>
      <CustomTextInput label="Name" value={name} onChangeText={setName} placeholder="Enter your name" />
      <CustomTextInput label="Email ID" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />
      <CustomTextInput label="Mobile Number" value={mobile} onChangeText={setMobile} placeholder="Enter your mobile number" keyboardType="phone-pad" />

      {/* Destination Information Section */}
      <TouchableOpacity onPress={() => setShowDestinationInfo(!showDestinationInfo)} style={styles.dropdownHeader}>
        <Text style={styles.sectionTitle}>Destination Information</Text>
        <Text>{showDestinationInfo ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showDestinationInfo && (
        <View>
          <CustomTextInput label="Address 1" value={address} onChangeText={setAddress} />
          <CustomTextInput label="Address 2" value={address1} onChangeText={setAddress1} />
          <CustomTextInput label="State Code" value={statecode} onChangeText={setStatecode} />
        </View>
      )}

      {/* Business Information Section */}
      <TouchableOpacity onPress={() => setShowBusinessInfo(!showBusinessInfo)} style={styles.dropdownHeader}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        <Text>{showBusinessInfo ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showBusinessInfo && (
        <View>
          <CustomTextInput label="GST Number" value={gstno} onChangeText={setGstno} />
          <CustomTextInput label="DL Number" value={dlno} onChangeText={setDlno} />
          <CustomTextInput label="Pan Number" value={pan} onChangeText={setPan} />
          <CustomTextInput 
            label="Credit Limit" 
            value={crlimits.toString()} 
            onChangeText={setCrlimit} 
            editable={false} // Non-editable field
          />
          <CustomTextInput 
            label="Discount" 
            value={discounts.toString()} 
            onChangeText={setDiscount} 
            editable={false} // Non-editable field
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.primeBlue,
    marginBottom: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});


export default ProfileInfoScreen;
