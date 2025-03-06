import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomTextInput from '../../../Components/Other/CustomInput';
import { Color } from '../../../Constant/Constants';

const CollectionProfileInfoScreen = ({ route }) => {
  const { userData } = route.params; // Fetch user data from route params


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomTextInput label="Employee Code" value={userData?.empCode || 'N/A'} editable={false} />
      <CustomTextInput label="Name" value={userData?.empName || 'N/A'} editable={false} />
      <CustomTextInput label="Mobile Number" value={userData?.phone || 'N/A'} editable={false} />
      <CustomTextInput label="Post" value={userData?.post || 'N/A'} editable={false} />
      <CustomTextInput label="Address" value={userData?.address || 'N/A'} editable={false} multiline />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    height:"100%"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.primeBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default CollectionProfileInfoScreen;
