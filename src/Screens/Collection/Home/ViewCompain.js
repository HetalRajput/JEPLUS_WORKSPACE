import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GetcollectionComplain } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import ComplainCard from '../../../Components/Collection/ComplainCard';

const ComplainScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await GetcollectionComplain();
     
      
      console.log('API Response:', response);

      if (response?.data && response.data.length > 0) {
        // Map the API response to match the expected structure
        const formattedComplaints = response.data.map(complaint => ({
          id: complaint.ComplaintID,
          name: `Party: ${complaint.Name}`,
          description: complaint.Desc1,
          date: new Date(complaint.vdt).toLocaleDateString(), // Format date
          status: 'Pending', // Default status, as it's not provided in the data
          enteredBy: complaint.EnteredBy,
          vno: complaint.Vno,
          acno: complaint.acno,
        }));
        setComplaints(formattedComplaints);
      } else {
        Alert.alert('No complaints found');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {complaints.length > 0 ? (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ComplainCard
              name={item.name}
              description={item.description}
              date={item.date}
              status={item.status}
              enteredBy={item.enteredBy}
              vno={item.vno}
              acno={item.acno}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noDataText}>No complaints available</Text>
      )}
    </View>
  );
};

export default ComplainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
   
  },
  header: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});